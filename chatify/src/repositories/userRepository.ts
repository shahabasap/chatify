import { Model } from "mongoose";
import { IUserRepository } from "../types/repository/IUserRepository";
import IUserSchema from "../types/schema/IUserSchema"


class UserRepository implements IUserRepository {
  private model: Model<IUserSchema>;

  constructor(model: Model<IUserSchema>) {
    this.model = model;
  }

 
  async createUser(uid: string): Promise<IUserSchema> {
    const existingUser = await this.model.findOne({ uid });
    if (existingUser) {
      return existingUser
    }
    return this.model.create({ uid });
  }
  async search(query: string): Promise<IUserSchema[]> {
    // Search users by name (you can extend this query to email or other fields)
    return this.model.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    }).exec();
  }


}

export default UserRepository;
