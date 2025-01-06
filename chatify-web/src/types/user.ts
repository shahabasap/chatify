export interface IUserType  {
    _id:string;
    uid: string;
    name: string;
    bio: string;
    phoneNo:string;
  }

  export interface IChats{
    chatId:string,
    user:IUserType
  }
  export default IUserType