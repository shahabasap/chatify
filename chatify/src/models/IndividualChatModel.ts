// models/IndividualChatModel.ts
import mongoose, { Schema } from "mongoose";
import IIndividualChatSchema from "../types/schema/IIndividualChatSchema";

const individualChatSchema: Schema<IIndividualChatSchema> = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const IndividualChatModel = mongoose.model<IIndividualChatSchema>(
  "IndividualChat",
  individualChatSchema
);
