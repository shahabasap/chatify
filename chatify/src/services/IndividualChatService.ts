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

  async getIndividualChats(userId: string): Promise<any[]> {
    const chats = await this.chatRepository.getChatsByUser(userId);

    return chats.map((chat) => {
      const receiver = chat.participants
        .filter((participant:any) => participant._id.toString() !== userId)
        .map((participant:any) => {
          return {
           chatId: chat._id,
           user:{ name: participant.name,
            uid: participant.uid,
            bio: participant.bio,
            phoneNo: participant.phoneNo}
          };
        });

      return receiver;
    });
  }

  async updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.updateLastMessage(chatId, messageId);
  }

  async blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.blockChat(chatId, blockedBy);
  }
}
