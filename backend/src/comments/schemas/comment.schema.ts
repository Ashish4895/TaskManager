import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, trim: true, maxlength: 1000 })
  text: string;

  @Prop({ required: true, trim: true })
  authorName: string;

  @Prop({ type: Types.ObjectId, ref: 'Todo', required: true })
  todo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
