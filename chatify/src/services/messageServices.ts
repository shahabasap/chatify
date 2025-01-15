
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
    try {
      // Create the message
      const message = await this.messageRepository.createMessage({
        senderId: userId,
        content,
        chatType,
        chat: chatId,
        replyTo,
        readBy: [userId],
      });
  
      if (!message) {
        throw new Error("Failed to create the message.");
      }
  
      // Update the last message in the respective chat
      if (chatType === "individual") {
        const updateResult = await this.individualChatRepository.updateLastMessage(
          chatId,
          message._id as string
        );
  
        if (!updateResult) {
          throw new Error("Failed to update the last message in the individual chat.");
        }
      } else {
        // Uncomment and implement for group chat when ready
        // const updateResult = await this.groupChatRepository.updateLastMessage(chatId, message._id);
        // if (!updateResult) {
        //   throw new Error("Failed to update the last message in the group chat.");
        // }
      }
  
      // Populate and return the created message
      const populatedMessage = await this.messageRepository.populateMessage(message);
  
      if (!populatedMessage) {
        throw new Error("Failed to populate the message.");
      }
  
      return populatedMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw new Error("An error occurred while sending the message. Please try again.");
    }
  }
  
}
