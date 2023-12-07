import { Schema, Types, model } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  userId: Types.ObjectId;
  reactionsCount: {
    thumbsUp: number;
    heart: number;
    wow: number;
    rocket: number;
    coffee: number;
  };
  reactions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  reactionsCount: {
    thumbsUp: { type: Number, default: 0, min: 0 },
    heart: { type: Number, default: 0, min: 0 },
    wow: { type: Number, default: 0, min: 0 },
    rocket: { type: Number, default: 0, min: 0 },
    coffee: { type: Number, default: 0, min: 0 },
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction", default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>("Post", postSchema);
