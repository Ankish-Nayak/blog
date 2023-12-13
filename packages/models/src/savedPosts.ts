import { Schema, model, Types } from "mongoose";

export interface SavedPost {
  postId: Types.ObjectId;
  savedBy: Types.ObjectId;
  savedAt: Date;
}

const savedPostSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  savedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  savedAt: { type: Date, default: Date.now() },
});

savedPostSchema.index({ postId: 1, savedBy: 1 }, { unique: true });

export const SavedPost = model<SavedPost>("SavedPost", savedPostSchema);
