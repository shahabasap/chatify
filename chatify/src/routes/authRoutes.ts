import express from "express";
import AuthController from "../controllers/authController";
import { userModel } from "../models/userModel";
import UserRepository from "../repositories/userRepository";
import { UserService } from "../services/userServices";

const router = express.Router();

const authRepository=new UserRepository(userModel)
const authService=new UserService(authRepository)
const authController=new AuthController(authService)

router.post("/",authController.createUser.bind(authController) );


export default router;
