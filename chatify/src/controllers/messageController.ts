// controllers/MessageController.ts
import { NextFunction, Request, Response } from "express";
import { IMessageService } from "../types/service/IMessageService";

export class MessageController {
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.messageService = messageService
  }

  async sendMessage(req: Request, res: Response,next:NextFunction) {
    try {
      // if (!req.user) {
      //   throw new Error("User is unauthorized");
      // }

      const { content, chatId, chatType, replyTo,userId } = req.body;

      const populatedMessage = await this.messageService.sendMessage({
        userId,
        content,
        chatId,
        chatType,
        replyTo,
      });

      res.status(201).json(populatedMessage);
    } catch (error) {
      next(error)
    }
  }
}
