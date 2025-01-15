// types/schema/IMessage.ts
import { Types, Document } from "mongoose";

 interface IMessageSchema extends Document {
  senderId: Types.ObjectId;
  content: string;
  chatType: "individual" | "group";
  chat: Types.ObjectId;
  readBy: Types.ObjectId[];
  replyTo?: Types.ObjectId;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default  IMessageSchema
