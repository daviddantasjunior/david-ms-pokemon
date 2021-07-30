import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  nickname: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  mail: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
