import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: '' })
  profilePic: string;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ sparse: true, unique: true })
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
