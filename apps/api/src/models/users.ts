import { Schema, Types, model } from "mongoose";

export interface IUser {
  name: string;
  email?: string;
  posts: Types.ObjectId[];
}

export const userSchema = new Schema<IUser>({
  name: { Type: String, required: true },
  email: { Type: String },
  posts: [{ Type: Schema.ObjectId, ref: "Post" }],
});

export const User = model<IUser>("User", userSchema);
