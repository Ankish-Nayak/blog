import { Schema, Types, model } from "mongoose";

interface INotification {
  reactionId: Types.ObjectId;
  authorId: Types.ObjectId;
  isRead: boolean;
}

const notificationSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    ref: "Reaction",
    required: true,
    unique: true,
  },
  isRead: {
    type: Schema.Types.Boolean,
    default: false,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
