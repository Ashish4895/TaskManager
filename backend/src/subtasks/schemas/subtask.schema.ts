import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TODO_PRIORITIES } from '../../todos/schemas/todo.schema';

export type SubtaskDocument = HydratedDocument<Subtask>;

@Schema({ timestamps: true })
export class Subtask {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ enum: TODO_PRIORITIES, default: 'none' })
  priority: string;

  @Prop()
  dueDate?: Date;

  @Prop({ trim: true })
  assigneeInitials?: string;

  @Prop({ type: Types.ObjectId, ref: 'Todo', required: true })
  todo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
