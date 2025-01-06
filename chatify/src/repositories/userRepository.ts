import { Model } from "mongoose";
import { IUserRepository } from "../types/repository/IUserRepository";
import IUserSchema from "../types/schema/IUserSchema"


class UserRepository implements IUserRepository {
  private model: Model<IUserSchema>;

  constructor(model: Model<IUserSchema>) {
    this.model = model;
  }

 
  async createUser(uid: string,phoneNo:string,name:string): Promise<IUserSchema> {
  
    const existingUser = await this.model.findOne({ phoneNo });
    if (existingUser) {
      return existingUser
    }
    return this.model.create({ uid,phoneNo,name });
  }
  async search(query: string,uid:string): Promise<IUserSchema[]> {
    if (!query.trim()) {
     
      return this.model.find({uid:{$ne:uid}}).exec();
    }
  
 
    return this.model.find({
      uid:{$ne:uid},
      name: { $regex: query, $options: "i" },
    }).exec();
  }
  async updateUserProfile(userId:string,name:string,bio:string): Promise<IUserSchema> {
   
    const updatedUser = await this.model.findByIdAndUpdate(
      userId,
      { $set: { name, bio } },
      { new: true } // Return the updated document
    )
    if (!updatedUser) {
      throw new Error("User not found or update failed.");
    }

    return updatedUser;

}
}

export default UserRepository;
