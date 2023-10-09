import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  roomId: string;

  @Prop()
  text: string;

  @Prop()
  fromId: string;
  toId: string;

  @Prop()
  timestamp: string;

  @Prop()
  replyId: string;

  @Prop()
  mediaUrl: string;
  @Prop()
  mediaType: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
