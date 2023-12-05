import express, { Request, Response } from "express";
import { authenticateJwt } from "../middlewares/auth";
import { ProfilePicture } from "models";
import multer from "multer";
import path from "path";

export const router = express.Router();
// storing images to disk space
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../../data/"));
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.originalname + "-" + Date.now() + path.extname(file.originalname),
//     );
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/profile/protected",
  authenticateJwt,
  async (req: Request, res: Response) => {
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
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  },
);
router.get("/profile/:userId", async (req: Request, res: Response) => {
  // const userId = req.headers.userId as string;
  const userId = req.params.userId as string;
  // const userId = "6564b90e082494272812ad98";

  try {
    const profilePicture = await ProfilePicture.findOne({ userId });
    if (profilePicture) {
      res.contentType(profilePicture.photo.contentType as string);
      res.send(profilePicture.photo.data);
    } else {
      res.status(404).json({
        error: "Not Found",
        message: "The requested resource could not be found in the database.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});

router.post(
  "/profile",
  authenticateJwt,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
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
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  },
);

router.delete(
  "/profile",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const userId = req.headers.userId as string;
    try {
      const deleteProfilePicture = await ProfilePicture.deleteOne({ userId });
      res.json({ message: "profile picture deleted" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  },
);
