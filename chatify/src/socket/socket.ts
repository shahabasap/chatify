// sockets/handleIndividualChatSocket.ts
import { Server, Socket } from "socket.io";
import { IndividualChatRepository } from "../repositories/individualChatRepository";
import { IndividualChatService } from "../services/IndividualChatService";
import { IndividualChatModel } from "../models/IndividualChatModel";
import { MessageService } from "../services/messageServices";
import MessageRepository from "../repositories/messageRepository";
import { MessageModel } from "../models/messageModel";

const handleIndividualChatSocket = (io: Server) => {
  const chatRepository = new IndividualChatRepository(IndividualChatModel);
  const chatService = new IndividualChatService(chatRepository);

  const messageRepository=new MessageRepository(MessageModel)
  const messageService=new MessageService(messageRepository,chatRepository)

  io.on("connection", (socket: Socket) => {
   

    // Join individual chat room
    socket.on("joinChat", async (data:{chatId:string}, callback: Function) => {
      try {
        const{chatId}=data
        socket.join(chatId);
        const chats = await chatService.getChatById(chatId);
        callback({ status: 200, data: chats });
      } catch (error) {
        callback({ status: 500, error: "Failed to fetch chats" });
      }
    });

    // Send a message
    socket.on("sendMessage", async (data: { chatId: string; senderId: string; message: string,chatType:string }, callback: Function) => {
      try {
        const { chatId, senderId, message ,chatType} = data;
  
        if (!chatId || !senderId || !message || !chatType) {
          callback({ status: 400, error: "Invalid data provided for sending a message." });
          return;
        }

        const chat = await messageService.sendMessage({  
          userId:senderId,
          content:message,
          chatId,
          chatType,
          })
         
        io.to(chatId).emit("receiveMessage", chat);
        callback({ status: 200, message: "Message sent successfully." });
      } catch (error) {
        callback({ status: 500, error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default handleIndividualChatSocket;
