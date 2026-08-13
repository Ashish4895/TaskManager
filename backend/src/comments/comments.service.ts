import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from '../todos/schemas/todo.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
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
    return this.commentModel
      .find({ todo: new Types.ObjectId(todoId), user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async create(userId: string, todoId: string, dto: CreateCommentDto) {
    await this.assertTodo(userId, todoId);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.commentModel.create({
      text: dto.text.trim(),
      authorName: user.fullName,
      todo: new Types.ObjectId(todoId),
      user: new Types.ObjectId(userId),
    });
  }

  async remove(userId: string, todoId: string, id: string) {
    await this.assertTodo(userId, todoId);
    const comment = await this.commentModel.findOneAndDelete({
      _id: id,
      todo: new Types.ObjectId(todoId),
      user: new Types.ObjectId(userId),
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return { message: 'Comment deleted' };
  }
}
