import { Schema, model, Types } from "mongoose";
import uniqueItemsValidator from "./validator/uniqueItemsValidator";

export interface IUser {
  name: string;
  email: string;
  posts: Types.ObjectId[];
  loginSessions: string[];
  avatar: Buffer;
  password: string;
}

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  posts: {
    validate: [uniqueItemsValidator],
    type: [Schema.Types.ObjectId],
    ref: "Post",
  },
  loginSessions: [{ type: String }],
  password: { type: String, default: "12345678" },
});

export const User = model<IUser>("User", userSchema);
