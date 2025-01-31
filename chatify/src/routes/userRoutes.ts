import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userServices";
import UserRepository from "../repositories/userRepository";
import { userModel } from "../models/userModel";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

// Instantiate the service and controller
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);


// Define the route for searching users
router.get("/search",authMiddleware, userController.searchUsers.bind(userController));
router.post("/profile", userController.updateProfile.bind(userController));


export default router;
