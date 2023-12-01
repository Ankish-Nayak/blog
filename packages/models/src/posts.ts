import { Schema, model } from "mongoose";

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
  userId: Schema.Types.ObjectId;
  reactions: IReactions;
  createdAt: Date;
  updatedAt: Date;
}
export interface IClick {
  clickedBy: { type: String };
  clickedAt: { type: Date };
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  reactions: {
    thumbsUp: [
      {
        type: {
          clickedBy: { type: String },
          clickedAt: { type: Date },
        },
      },
    ],
    wow: [
      {
        type: {
          clickedBy: { type: String },
          clickedAt: { type: Date },
        },
      },
    ],
    heart: [
      {
        type: {
          clickedBy: { type: String },
          clickedAt: { type: Date, default: Date.now },
        },
      },
    ],
    rocket: [
      {
        type: {
          clickedBy: { type: String },
          clickedAt: { type: Date, default: Date.now },
        },
      },
    ],
    coffee: [
      {
        type: {
          clickedBy: { type: String },
          clickedAt: { type: Date, default: Date.now },
        },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>("Post", postSchema);
