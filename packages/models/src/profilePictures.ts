import { Schema, model, Types } from "mongoose";

export interface IProfilePicture {
  userId: Types.ObjectId;
  createAt: Date;
  uploadedAt: Date;
  // photos: { name: string; photo: Buffer; uploadedAt: Date }[];
  photo: {
    data: Buffer;
    contentType: String;
  };
}

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  upadatedAt: { type: Date, default: Date.now },
  photo: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
});

export const ProfilePicture = model<IProfilePicture>(
  "ProfilePicture",
  profileSchema,
);
