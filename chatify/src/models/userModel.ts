import { model, Schema } from "mongoose";
import IUserSchema  from "../types/schema/IUserSchema"



const userSchema = new Schema<IUserSchema>({
  uid: { type: String, required: true },
  name: { type: String, required: true },  
  bio: { type: String, default: "" },      
});

export const userModel = model<IUserSchema>("User", userSchema);
