import IUserSchema from "../schema/IUserSchema"



 interface IUserService {
  searchUsers(query: string): Promise<IUserSchema[]>; // Method to search users by query
  createUser(uid: string,phoneNo:string,name:string): Promise<IUserSchema>;
  updateProfile(userId:string,name:string,bio:string): Promise<IUserSchema>;
}

export default IUserService
