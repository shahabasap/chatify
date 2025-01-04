import mongoose from "mongoose";

// models/GroupChat.ts
const groupChatSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    avatar: { 
      type: String 
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['admin', 'moderator', 'member'],
        default: 'member'
      }
    }],
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
  export const GroupChat = mongoose.model('GroupChat', groupChatSchema);
  