import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

function syncCompleted(status?: string, completed?: boolean) {
  if (status === 'completed') return true;
  if (status && status !== 'completed') return false;
  if (completed === true) return true;
  if (completed === false) return false;
  return undefined;
}

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  create(userId: string, dto: CreateTodoDto) {
    const status = dto.status ?? 'todo';
    return this.todoModel.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      status,
      priority: dto.priority ?? 'none',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      ...(dto.projectId && { project: new Types.ObjectId(dto.projectId) }),
      completed: status === 'completed',
      user: new Types.ObjectId(userId),
    });
  }

  findAll(userId: string) {
    return this.todoModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const completed = syncCompleted(dto.status, dto.completed);
    const status =
      dto.status ?? (dto.completed === true ? 'completed' : dto.completed === false ? 'todo' : undefined);

    const todo = await this.todoModel.findOneAndUpdate(
      { _id: id, user: new Types.ObjectId(userId) },
      {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && {
          description: dto.description.trim(),
        }),
        ...(status !== undefined && { status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.projectId !== undefined && {
          project: dto.projectId ? new Types.ObjectId(dto.projectId) : null,
        }),
        ...(completed !== undefined && { completed }),
      },
      { new: true },
    );

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async remove(userId: string, id: string) {
    const todo = await this.todoModel.findOneAndDelete({
      _id: id,
      user: new Types.ObjectId(userId),
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return { message: 'Todo deleted' };
  }
}
