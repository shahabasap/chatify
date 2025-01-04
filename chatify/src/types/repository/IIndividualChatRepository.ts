// types/repository/IIndividualChatRepository.ts
import  IIndividualChatSchema  from "../schema/IIndividualChatSchema";

export interface IIndividualChatRepository {
  createChat(participants: string[]): Promise<IIndividualChatSchema>;
  findChatByParticipants(participants: string[]): Promise<IIndividualChatSchema | null>;
  getChatsByUser(userId: string): Promise<IIndividualChatSchema[]>;
  updateLastMessage(chatId: string, messageId: string): Promise<IIndividualChatSchema | null>;
  blockChat(chatId: string, blockedBy: string): Promise<IIndividualChatSchema | null>;
}
