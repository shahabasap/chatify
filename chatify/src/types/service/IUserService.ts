import IUserSchema from "../schema/IUserSchema"



 interface IUserService {
  searchUsers(query: string): Promise<IUserSchema[]>; // Method to search users by query
  createUser(uid: string): Promise<IUserSchema>;
}

export default IUserService
