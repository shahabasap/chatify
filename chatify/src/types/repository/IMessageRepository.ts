import IMessageSchema from "../schema/IMessageSchema";




export interface IMessageRepository {
  createMessage(data: any): Promise<IMessageSchema>;
  populateMessage(message: any): Promise<any>;
}
