import { userModel } from "../models/userModel";
import { IUserRepository } from "../types/repository/IUserRepository";
import  IuserSchema  from "../types/schema/IUserSchema";
import  IUserService from "../types/service/IUserService";


export class UserService implements IUserService{
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(uid: string,phoneNo:string,name:string): Promise<IuserSchema> {
    try {
      const user = this.userRepository.createUser(
        uid,phoneNo,name
       );
      return user;
    } catch (error) {
      throw new Error("Error creating user");
    }
  }
  // Search users by name (or extend for other criteria like email, etc.)
  async searchUsers(query: string,uid:string): Promise<IuserSchema[]> {
    try {
      return await this.userRepository.search(query,uid);
    } catch (error) {
      throw new Error("Error searching users");
    }
  }
  async updateProfile(userId:string,name:string,bio:string): Promise<IuserSchema> {
    try {
      return await this.userRepository.updateUserProfile(userId,name,bio);
    } catch (error) {
      throw new Error("Error searching users");
    }
  }
}
