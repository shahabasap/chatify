// services/interfaces/IMessageService.ts
export interface IMessageService {
    sendMessage(params: {
      userId: string;
      content: string;
      chatId: string;
      chatType: string;
      replyTo?: string;
    }): Promise<any>;
  }
  