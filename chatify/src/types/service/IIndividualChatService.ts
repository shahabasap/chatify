// types/service/IIndividualChatService.ts

import IIndividualChatSchema  from "../schema/IIndividualChatSchema";


export interface IIndividualChatService {
  createIndividualChat(participants: string[]): Promise<IIndividualChatSchema>;
  getIndividualChats(userId: string): Promise<IIndividualChatSchema[]>;
  updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null>;
  blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null>;
}

export default  IIndividualChatService
