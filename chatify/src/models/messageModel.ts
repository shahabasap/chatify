import mongoose from "mongoose";
import IMessageSchema from "../types/schema/IMessageSchema";

// models/Message.ts
const messageSchema = new mongoose.Schema<IMessageSchema>({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    chatType: {
      type: String,
      enum: ['individual', 'group'],
      required: true
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'chatType'
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    attachments: [{
      type: String
    }]
  }, { timestamps: true });
  
  export const MessageModel = mongoose.model<IMessageSchema>('Message', messageSchema);

  