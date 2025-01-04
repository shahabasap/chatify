// types/schema/IIndividualChatSchema.ts
import { Types, Document } from "mongoose";

export default interface IIndividualChatSchema extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  isBlocked: boolean;
  blockedBy?: Types.ObjectId;
}
