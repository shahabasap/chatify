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
   
      const{user}=req
      const query = req.query.query as string; 
      const users = await this.userService.searchUsers(query,user.uid as string); // Call the service
      res.status(200).json({ users });
    } catch (error) {
      next(error)
    }
  }
  async updateProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const {userId,name,bio} = req.body
    

      const users = await this.userService.updateProfile(userId,name,bio); // Call the service
      res.status(200).json({ users });
    } catch (error) {
      next(error)
    }
  }
}
