import express, { Request, Response } from "express";
import { User } from "../models";
export const router = express.Router();

// get all users
router.get("/", async (_, res: Response) => {
  try {
    const users = await User.find({});
    return res.json({ users });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});

// get one user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingUser = await User.findOne({ _id: id });
    if (existingUser) {
      res.json({ existingUser });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});
