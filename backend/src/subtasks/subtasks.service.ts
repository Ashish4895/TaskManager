import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Todo, TodoDocument } from '../todos/schemas/todo.schema';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask, SubtaskDocument } from './schemas/subtask.schema';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async assertTodo(userId: string, todoId: string) {
    const todo = await this.todoModel.findOne({
      _id: todoId,
      user: new Types.ObjectId(userId),
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async findAll(userId: string, todoId: string) {
    await this.assertTodo(userId, todoId);
    return this.subtaskModel
      .find({ todo: new Types.ObjectId(todoId), user: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 });
  }

  async create(userId: string, todoId: string, dto: CreateSubtaskDto) {
    await this.assertTodo(userId, todoId);
    const user = await this.userModel.findById(userId);
    const initials =
      dto.assigneeInitials?.trim() ||
      user?.fullName?.slice(0, 2).toUpperCase() ||
      'ME';

    return this.subtaskModel.create({
      title: dto.title.trim(),
      priority: dto.priority ?? 'none',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      assigneeInitials: initials,
      todo: new Types.ObjectId(todoId),
      user: new Types.ObjectId(userId),
    });
  }

  async update(userId: string, todoId: string, id: string, dto: UpdateSubtaskDto) {
    await this.assertTodo(userId, todoId);
    const subtask = await this.subtaskModel.findOneAndUpdate(
      {
        _id: id,
        todo: new Types.ObjectId(todoId),
        user: new Types.ObjectId(userId),
      },
      {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.assigneeInitials !== undefined && {
          assigneeInitials: dto.assigneeInitials.trim(),
        }),
      },
      { new: true },
    );
    if (!subtask) throw new NotFoundException('Subtask not found');
    return subtask;
  }

  async remove(userId: string, todoId: string, id: string) {
    await this.assertTodo(userId, todoId);
    const subtask = await this.subtaskModel.findOneAndDelete({
      _id: id,
      todo: new Types.ObjectId(todoId),
      user: new Types.ObjectId(userId),
    });
    if (!subtask) throw new NotFoundException('Subtask not found');
    return { message: 'Subtask deleted' };
  }
}
