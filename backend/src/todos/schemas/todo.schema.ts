import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

export const TODO_STATUSES = ['todo', 'doing', 'completed', 'on_hold'] as const;
export const TODO_PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'] as const;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ enum: TODO_STATUSES, default: 'todo' })
  status: string;

  @Prop({ enum: TODO_PRIORITIES, default: 'none' })
  priority: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.set('toJSON', {
  transform(_doc, ret) {
    const { project, ...rest } = ret;
    return {
      ...rest,
      ...(project && { projectId: String(project) }),
    };
  },
});
