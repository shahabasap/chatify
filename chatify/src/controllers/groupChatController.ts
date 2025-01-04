// import { Request, Response } from "express";
// import { GroupChatService } from "../services/groupChatService";

// export class GroupChatController {
//   constructor(private groupChatService: GroupChatService) {}

//   createGroupChat = async (req: Request, res: Response): Promise<void> => {
//     try {
//         if(!req.user)
//         { throw Error("user is unauthorized")}

//       const { name, description, members } = req.body;
//       const userId = req.user.id;

//       const groupChat = await this.groupChatService.createGroupChat(name, description, members, userId);
//       res.status(201).json(groupChat);
//     } catch (error) {
//       res.status(500).json({ message: "Error creating group chat", error });
//     }
//   };

//   getGroupChats = async (req: Request, res: Response): Promise<void> => {
//     try {
//         if(!req.user)
//             { throw Error("user is unauthorized")}
//       const userId = req.user.id;

//       const groupChats = await this.groupChatService.getGroupChats(userId);
//       res.json(groupChats);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching group chats", error });
//     }
//   };
// }
