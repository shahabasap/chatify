// repositories/IndividualChatRepository.ts
import mongoose, { Model } from "mongoose";
import { IIndividualChatRepository } from "../types/repository/IIndividualChatRepository";
import   IIndividualChatSchema  from "../types/schema/IIndividualChatSchema";

export class IndividualChatRepository implements IIndividualChatRepository {
  private model:Model<IIndividualChatSchema>
  constructor(model:Model<IIndividualChatSchema>)
  {
    this.model=model
  }
  async createChat(participants: string[]): Promise<IIndividualChatSchema> {
    const chat = await this.model.create({ participants });
    return chat;
  }

  async findChatByParticipants(participants: string[]): Promise<IIndividualChatSchema | null> {
    const chat = await this.model.findOne({ participants: { $all: participants } })
      .populate("participants")
      .populate("lastMessage")
      
    return chat;
  }
  async getById(chatId: string): Promise<IIndividualChatSchema | null> {
    const chat = await this.model.findById(chatId)
      .populate("participants")
      .populate("lastMessage")
      .populate("messages")
    return chat;
  }

  async getChatsByUser(userId: string): Promise<any[]> {
    const chats = await this.model.find({ participants: {$in:[userId]} })
      .populate("participants")
      .populate("lastMessage")
      .populate("messages").exec()
     
    
    return chats;
  }

  async updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null> {
    const chat = await this.model.findByIdAndUpdate(
      chatId,
      { $set: { lastMessage: messageId }, $push: { messages: messageId } },
      { new: true }
    ).exec()

   
    return chat;
  }

  async blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null> {
    const chat = await this.model.findByIdAndUpdate(
      chatId,
      { isBlocked: true, blockedBy },
      { new: true }
    );
    return chat;
  }
}
