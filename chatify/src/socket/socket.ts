// sockets/handleIndividualChatSocket.ts
import { Server, Socket } from "socket.io";
import { IndividualChatRepository } from "../repositories/individualChatRepository";
import { IndividualChatService } from "../services/IndividualChatService";
import { IndividualChatModel } from "../models/IndividualChatModel";

const handleIndividualChatSocket = (io: Server) => {
  const chatRepository = new IndividualChatRepository(IndividualChatModel);
  const chatService = new IndividualChatService(chatRepository);

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join individual chat room
    socket.on("joinChat", async (data: { userId: string }, callback: Function) => {
      try {
        const { userId } = data;
        const chats = await chatService.getIndividualChats(userId);
        callback({ status: 200, data: chats });
      } catch (error) {
        callback({ status: 500, error: "Failed to fetch chats" });
      }
    });

    // Send a message
    socket.on("sendMessage", async (data: { chatId: string; senderId: string; message: string }, callback: Function) => {
      try {
        const { chatId, senderId, message } = data;

        if (!chatId || !senderId || !message) {
          callback({ status: 400, error: "Invalid data provided for sending a message." });
          return;
        }

        const chat = await chatService.createIndividualChat([chatId, senderId]);
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
