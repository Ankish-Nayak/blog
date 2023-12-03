import { Schema, model } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId;
  reactionsCount: {
    thumbsUp: number;
    heart: number;
    wow: number;
    rocket: number;
    coffee: number;
  };
  reactions: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReactions {
  thumbsUp: Schema.Types.ObjectId[];
  wow: Schema.Types.ObjectId[];
  heart: Schema.Types.ObjectId[];
  rocket: Schema.Types.ObjectId[];
  coffee: Schema.Types.ObjectId[];
}
export interface IClick {
  clickedBy: string;
  clickedAt: Date;
}
const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  reactionsCount: {
    thumbsUp: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    rocket: { type: Number, default: 0 },
    coffee: { type: Number, default: 0 },
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction", default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>("Post", postSchema);
