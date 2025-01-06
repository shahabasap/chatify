
import { IIndividualChatRepository } from "../types/repository/IIndividualChatRepository";
import { IMessageRepository } from "../types/repository/IMessageRepository";
import { IMessageService } from "../types/service/IMessageService";

export class MessageService implements IMessageService {
  private messageRepository: IMessageRepository;
  private individualChatRepository: IIndividualChatRepository;
//   private groupChatRepository: GroupChatRepository;

  constructor(messageRepository: IMessageRepository,individualChatRepository: IIndividualChatRepository) {
    this.messageRepository =messageRepository
    this.individualChatRepository = individualChatRepository
    // this.groupChatRepository = new GroupChatRepository();
  }

  async sendMessage({
    userId,
    content,
    chatId,
    chatType,
    replyTo,
   
  }: {
    userId: string;
    content: string;
    chatId: string;
    chatType: string;
    replyTo?: string;
   
  }) {
    const message = await this.messageRepository.createMessage({
      sender: userId,
      content,
      chatType,
      chat: chatId,
      replyTo,
      readBy: [userId],

    });

    if (chatType === "individual") {
      await this.individualChatRepository.updateLastMessage(chatId, message._id as string);
    } else {
    //   await this.groupChatRepository.updateLastMessage(chatId, message._id);
    }

    return this.messageRepository.populateMessage(message);
  }
}
