import { NextFunction, Request, Response } from "express";
import IUserService from "../types/service/IUserService";


export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  // Controller action for searching users
  async searchUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const query = req.query.query as string; // Get the query parameter from the request
      if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }

      const users = await this.userService.searchUsers(query); // Call the service
      res.status(200).json({ users });
    } catch (error) {
      next(error)
    }
  }
}
