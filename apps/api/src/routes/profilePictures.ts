import express, { NextFunction, Request, Response } from "express";
import { ProfilePicture } from "models";
import multer from "multer";
import * as profilePictureController from "../controllers/profilePictureController";
import { authenticateJwt } from "../middlewares/auth";

export const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/profile/protected",
  authenticateJwt,
  profilePictureController.getProfilePic,
);
router.get(
  "/profile/:userId",
  authenticateJwt,
  profilePictureController.getUserProfilePic,
);

router.post(
  "/profile",
  authenticateJwt,
  upload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.userId as string;
    if (typeof req.file === "undefined") {
      return res.status(400).json({ message: "file not provided" });
    }
    try {
      const pic = req.file.buffer;
      console.log("pic", pic);
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
        });
      } else {
        res.status(403).json({ message: " failed to create" });
      }
    } catch (e) {
      next(e);
    }
  },
);

router.put(
  "/profile",
  authenticateJwt,
  profilePictureController.updateProfilePic,
);

router.delete(
  "/profile",
  authenticateJwt,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ message: "profile picture deleted" });
    } catch (e) {
      next(e);
    }
  },
);
