import { Schema, Types, model } from "mongoose";

export interface IReactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface IPost {
  title: string;
  content: string;
  userId: Types.ObjectId;
  reactions: IReactions;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  reactions: {
    thumbsUp: { type: Number },
    wow: { type: Number },
    heart: { type: Number },
    rocket: { type: Number },
    coffee: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>("Post", postSchema);
