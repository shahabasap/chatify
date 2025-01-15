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
  async getChatById(chatId: string): Promise<IIndividualChatSchema |null> {
      
    const chat = await this.chatRepository.getById(chatId);
    return chat
  }

  async getIndividualChats(userId: string): Promise<any[]> {
    const chats = await this.chatRepository.getChatsByUser(userId);
  
    // Use flatMap instead of map to flatten the result
    return chats.flatMap((chat) => {
      return chat.participants
        .filter((participant: any) => participant._id.toString() !== userId)
        .map((participant: any) => ({
          chatId: chat._id,
          user: {
            _id:participant._id,
            name: participant.name,
            uid: participant.uid,
            bio: participant.bio,
            phoneNo: participant.phoneNo
          }
        }));
    });
  }
  

  async updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.updateLastMessage(chatId, messageId);
  }

  async blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null> {
    return this.chatRepository.blockChat(chatId, blockedBy);
  }
}
