// controllers/IndividualChatController.ts
import { Request, Response, NextFunction } from "express";
import { IIndividualChatService } from "../types/service/IIndividualChatService";

export class IndividualChatController {
  private chatService: IIndividualChatService;

  constructor(chatService: IIndividualChatService) {
    this.chatService = chatService;
  }

  async createIndividualChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { participants } = req.body;
        
      if (!participants || participants.length !== 2) {
        res.status(400).json({ error: "Participants must include exactly two user IDs." });
        return;
      }

      const chat = await this.chatService.createIndividualChat(participants);
      res.status(200).json(chat);
    } catch (error) {
      next(error); // Pass error to the error-handling middleware
    }
  }

  async getIndividualChats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    const {userId}=req.params

      const chats = await this.chatService.getIndividualChats(userId);
      res.status(200).json(chats);
    } catch (error) {
      next(error); // Pass error to the error-handling middleware
    }
  }
  // async updateChat(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const userId = req.user?.id; // Assuming authentication middleware adds `req.user`

  //     if (!userId) {
  //       res.status(401).json({ error: "Unauthorized" });
  //       return;
  //     }
  //     const chatId=req?.params.chatId
  //     if(chatId)
  //     {
  //       throw new Error("chatId is required")
  //     }

  //     const chats = await this.chatService.UpdateChatMessage(chatId);
  //     res.status(200).json(chats);
  //   } catch (error) {
  //     next(error); // Pass error to the error-handling middleware
  //   }
  // }

  async blockChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chatId } = req.params;
      const blockedBy = req.user?.id;

      if (!blockedBy) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const blockedChat = await this.chatService.blockChat(chatId, blockedBy);
      if (!blockedChat) {
        res.status(404).json({ error: "Chat not found" });
        return;
      }

      res.status(200).json(blockedChat);
    } catch (error) {
      next(error); // Pass error to the error-handling middleware
    }
  }
}
