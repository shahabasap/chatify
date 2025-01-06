export interface IUserSchema extends Document {
  uid: string;
  name: string;
  bio: string;
  phoneNo:string;
}
export default IUserSchema