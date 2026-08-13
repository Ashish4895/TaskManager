import { NextFunction, Request, RequestHandler, Response } from "express";
import Todo from "../models/todo.model";
import { z } from "zod";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// Zod schemas
const createTodoSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  completed: z.boolean().optional(),
});

// Create a new todo
export const createTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const parseResult = createTodoSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { title, description } = parseResult.data;

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim(),
      user: userId,
    });

    res.status(201).json({ success: true, todo });
  } catch (error) {
    // res.status(500).json({ success: false, message: "Failed to create todo" });
    next(error);
  }
};

// Get all todos for the authenticated user
export const getTodos = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    // res.status(500).json({ success: false, message: "Failed to fetch todos" });
    next(error);
  }
};

// Update a todo
export const updateTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const parseResult = updateTodoSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { title, description, completed } = parseResult.data;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: userId },
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(completed !== undefined && { completed }),
      },
      { new: true }
    );

    if (!todo) {
      res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, todo });
  } catch (error) {
    // res.status(500).json({ success: false, message: "Failed to update todo" });
    next(error);
  }
};

// Delete a todo
export const deleteTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, user: userId });

    if (!todo) {
      res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, message: "Todo deleted" });
  } catch (error) {
    // res.status(500).json({ success: false, message: "Failed to delete todo" });
    next(error);
  }
};