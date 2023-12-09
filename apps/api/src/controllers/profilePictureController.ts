import { NextFunction, Request, Response } from "express";
import { ProfilePicture } from "models";

export const getProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  try {
    const profilePicture = await ProfilePicture.findOne({ userId });
    if (profilePicture) {
      res.json({ photo: profilePicture.photo });
    } else {
      res.status(402).json({ message: "profile photo not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const getUserProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId as string;
  try {
    const profilePicture = await ProfilePicture.findOne({ userId });
    if (profilePicture) {
      res.json({ photo: profilePicture.photo });
    } else {
      res.status(402).json({ message: "profile photo not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const updateProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  if (typeof req.file === "undefined") {
    return res.status(400).json({
      error: "Bad Request - Missing required data",
    });
  }
  try {
    const { buffer, mimetype } = req.file;
    const updatedProfile = await ProfilePicture.findOneAndUpdate(
      { userId },
      {
        $set: {
          photo: {
            contentType: mimetype,
            data: buffer,
          },
        },
        updatedAt: Date.now(),
      },
      { new: true },
    );
    if (updatedProfile) {
      res.json({
        message: "profile updated successfully",
        photo: updatedProfile.photo,
      });
    } else {
      try {
        const profilePicture = await ProfilePicture.create({
          userId,
          photo: {
            contentType: req.file.mimetype,
            data: req.file.buffer,
          },
        });
        if (profilePicture) {
          res.status(201).json({
            message: "Profile created successfully",
            id: profilePicture._id,
            photo: profilePicture.photo,
          });
        } else {
          res.status(403).json({ message: " failed to create" });
        }
      } catch (e) {
        next(e);
      }
    }
  } catch (e) {
    next(e);
  }
};
