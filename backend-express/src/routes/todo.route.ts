import { Router } from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todo.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

// All todo routes are protected
router.post("/", protectRoute, createTodo);
router.get("/", protectRoute, getTodos);
router.put("/:id", protectRoute, updateTodo);
router.delete("/:id", protectRoute, deleteTodo);

export default router;