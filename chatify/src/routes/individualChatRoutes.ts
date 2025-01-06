import express from "express";
import { IndividualChatModel } from "../models/IndividualChatModel";
import { IndividualChatRepository } from "../repositories/individualChatRepository";
import { IndividualChatService } from "../services/IndividualChatService";
import { IndividualChatController } from "../controllers/individualChatController";
import { MessageController } from "../controllers/messageController";
import { MessageService } from "../services/messageServices";
import MessageRepository from "../repositories/messageRepository";
import { MessageModel } from "../models/messageModel";


const router = express.Router();

const chatRepository = new IndividualChatRepository(IndividualChatModel);
const chatService = new IndividualChatService(chatRepository);
const chatController = new IndividualChatController(chatService);
const messageRepository=new MessageRepository(MessageModel)
const messageService=new MessageService(messageRepository,chatRepository)
const messageController=new MessageController(messageService)


router.post("/chats", chatController.createIndividualChat.bind(chatController));
router.get("/chats/:userId", chatController.getIndividualChats.bind(chatController));
// router.get("/chats/:chatId", chatController.updateChat.bind(chatController));
router.patch("/chats/:chatId/block", chatController.blockChat.bind(chatController));

router.post("/send", messageController.sendMessage.bind(messageController));
// small

export default router;
