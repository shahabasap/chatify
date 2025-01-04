// import { GroupChatModel } from "../models/grouptChatModel";
// import { MessageModel } from "../models/messageModel";

// export class GroupChatRepository {
    
//   async createGroupChat(data: any): Promise<any> {
//     const groupChat = await GroupChatModel.create(data);
//     return groupChat.populate("members.user", "username avatar").populate("admins", "username");
//   }

//   async getUserGroupChats(userId: string): Promise<any[]> {
//     return GroupChatModel.find({
//       "members.user": userId,
//       isArchived: false,
//     })
//       .populate("members.user", "username avatar")
//       .populate("admins", "username")
//       .populate("lastMessage")
//       .sort("-updatedAt");
//   }
// }
