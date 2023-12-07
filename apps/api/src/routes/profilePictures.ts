import express, { NextFunction, Request, Response } from "express";
import { ProfilePicture } from "models";
import multer from "multer";
import { authenticateJwt } from "../middlewares/auth";

export const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/profile/protected",
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.userId as string;
    console.log("userId", userId);
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
  },
);
router.get(
  "/profile/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
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
  upload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hitititit");
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
  },
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
