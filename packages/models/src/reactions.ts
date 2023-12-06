import { Schema, model, Types } from "mongoose";

interface IReactionSchema {
  postId: Types.ObjectId;
  clickedAt: Date;
  clickedBy: Types.ObjectId;
  reactionType: "thumbsUp" | "heart" | "wow" | "coffee" | "rocket";
}

const reactionsType = ["thumbsUp", "heart", "wow", "coffee", "rocket"];
const reactionSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  clickedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  clickedAt: { type: Schema.Types.Date, default: Date.now },
  reactionType: {
    type: String,
    enum: reactionsType,
    required: true,
  },
});

reactionSchema.index(
  { postId: 1, reactionType: 1, clickedBy: 1 },
  { unique: true },
);

export const Reaction = model<IReactionSchema>("Reaction", reactionSchema);
