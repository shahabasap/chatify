import { Model } from "mongoose";
import { IMessageRepository } from "../types/repository/IMessageRepository";
import IMessageSchema from "../types/schema/IMessageSchema";


 class MessageRepository implements IMessageRepository {
      private model:Model<IMessageSchema>
      constructor(model:Model<IMessageSchema>)
      {
        this.model=model
      }
      
  async createMessage(data: any):Promise<IMessageSchema > {
    
    const response= await this.model.create(data);
    
    return response
  }

  async populateMessage(message: any) {
    return await message.populate("senderId", "username avatar");
  }
}
export default MessageRepository
