import { Server, Socket } from "socket.io";
import { IndividualChatRepository } from "../repositories/individualChatRepository";
import { IndividualChatService } from "../services/IndividualChatService";
import { MessageService } from "../services/messageServices";
import { IndividualChatModel } from "../models/IndividualChatModel";
import MessageRepository from "../repositories/messageRepository";
import { MessageModel } from "../models/messageModel";

const handleIndividualChatSocket = (io: Server) => {
  const chatRepository = new IndividualChatRepository(IndividualChatModel);
  const chatService = new IndividualChatService(chatRepository);
  const messageRepository = new MessageRepository(MessageModel);
  const messageService = new MessageService(messageRepository, chatRepository);

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    
    if (!userId) {
      socket.disconnect();
      return;
    }



    // Join individual chat room
    socket.on("joinChat", async (data: { chatId: string }, callback: Function) => {
      try {
        const { chatId } = data;
        
        // Leave previous rooms
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        socket.join(chatId);
        
        // Fetch chat history
        const chat = await chatService.getChatById(chatId);
        callback({ status: 200, data: chat });
      } catch (error) {
        console.error("Join chat error:", error);
        callback({ status: 500, error: "Failed to join chat" });
      }
    });

    socket.on('chatListUpdate', async (userId: string) => {
      try {
        const chats = await chatService.getIndividualChats(userId);
        socket.emit('chats', chats);
      } catch (error) {
        console.error("Chat list update error:", error);
        socket.emit('error', 'Failed to load chats');
      }
    });

    socket.on("sendMessage", async (data: {
      chatId: string;
      senderId: string;
      message: string;
      chatType: string;
    }, callback: Function) => {
      try {
        const { chatId, senderId, message, chatType } = data;

        if (!chatId || !senderId || !message || !chatType) {
          callback({ status: 400, error: "Invalid data provided" });
          return;
        }

        const newMessage = await messageService.sendMessage({
          userId: senderId,
          content: message,
          chatId,
          chatType,
        });
        const getMessage={
          senderId:newMessage.senderId._id,
          content:newMessage.content,
          chatType:newMessage.chatType,
          chat:newMessage.chat,
          replyTo:newMessage.replyTo,
          readBy:newMessage.readBy,
          createdAt:newMessage.createdAt,
          updatedAt:newMessage.createdAt
        }

        // Broadcast to all users in the chat room
        io.to(chatId).emit("receiveMessage", getMessage);
        callback({ status: 200, message: "Message sent successfully" });
      } catch (error) {
        console.error("Send message error:", error);
        callback({ status: 500, error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export default handleIndividualChatSocket;