import { Request, Response } from "express";
import IUserService from "../types/service/IUserService";



class AuthController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

 async createUser(req: Request, res: Response) {
    const { uid } = req.body;

    try {
      const user = await this.userService.createUser(uid)
    
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "failed to create user", error });
    }
  }


}

export default AuthController;
