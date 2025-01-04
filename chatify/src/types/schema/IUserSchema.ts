export interface IUserSchema extends Document {
  uid: string;
  name: string;
  bio: string;
}
export default IUserSchema