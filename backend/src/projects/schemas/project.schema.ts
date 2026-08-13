import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TODO_PRIORITIES } from '../../todos/schemas/todo.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ enum: TODO_PRIORITIES, default: 'none' })
  priority: string;

  @Prop({ default: '' })
  leadInitials: string;

  @Prop({ default: '#8b5cf6' })
  leadColor: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
