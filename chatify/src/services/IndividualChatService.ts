// services/IndividualChatService.ts

import { IIndividualChatRepository } from "../types/repository/IIndividualChatRepository";
import  IIndividualChatSchema  from "../types/schema/IIndividualChatSchema";
import { IIndividualChatService } from "../types/service/IIndividualChatService";


export class IndividualChatService implements IIndividualChatService {
  private chatRepository: IIndividualChatRepository;

  constructor(chatRepository: IIndividualChatRepository) {
    this.chatRepository = chatRepository;
  }

  async createIndividualChat(participants: string[]): Promise<IIndividualChatSchema> {
      
    const existingChat = await this.chatRepository.findChatByParticipants(participants);


    if (existingChat) {
      return existingChat;
    }
    

    return this.chatRepository.createChat(participants);
  }

  async getIndividualChats(userId: string): Promise<IIndividualChatSchema[]> {
 
    return this.chatRepository.getChatsByUser(userId);
  }

  async updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.updateLastMessage(chatId, messageId);
  }

  async blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.blockChat(chatId, blockedBy);
  }
}
