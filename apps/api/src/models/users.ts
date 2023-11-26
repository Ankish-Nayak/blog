import { Schema, Types, model } from "mongoose";

export interface IUser {
  name: string;
  email?: string;
  posts: Schema.Types.ObjectId[];
}

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export const User = model<IUser>("User", userSchema);
