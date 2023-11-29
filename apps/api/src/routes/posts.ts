import express from "express";
import { Request, Response } from "express";
import { IPost, IReactions, Post, User } from "models";
import { authenticateJwt } from "../middlewares/auth";

export const router = express.Router();

// get all posts and get by userId
router.get("/", async (req: Request, res: Response) => {
  if (typeof req.query.userId === "string") {
    try {
      const userId: string = req.query.userId;
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        const posts = await Post.find({ userId: existingUser._id });
        if (posts) {
          res.json({ posts });
        } else {
          res.status(402).json({ message: "posts dose not exists" });
        }
      } else {
        res.status(403).json({ message: "User dose not exists" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else if (typeof req.query.name === "string") {
    try {
      const name: string = req.query.name;
      const users = await User.find({ name: name });
      const ids = users.map((user) => user._id.toString());
      console.log(ids);
      if (typeof req.query.title === "string") {
        const posts = await Post.find({
          userId: { $in: ids },
          title: { $regex: req.query.title, $options: "i" },
        });
        res.json({ posts });
      } else {
        const posts = await Post.find({ userId: { $in: ids } });
        res.json({ posts });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else if (typeof req.query.title === "string") {
    const posts = await Post.find({
      title: { $regex: req.query.title, $options: "i" },
    });
    res.json({ posts });
  } else {
    try {
      const posts = await Post.find({});
      return res.json({ posts: posts, message: "updated new" });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "internal error" });
    }
  }
});

// get one post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // const id = req.query.id;
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    if (post) {
      return res.json({ post });
    } else {
      return res.status(403).json({ message: "Post not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal error" });
  }
});

// create new post
router.post("/", authenticateJwt, async (req: Request, res: Response) => {
  try {
    const data: IPost = req.body;
    const newPost = new Post({
      ...data,
    });
    await newPost.save();
    return res.json({ _id: newPost._id, message: "post created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error" });
  }
});

// update post
router.put("/:id", authenticateJwt, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const data: IPost = req.body;
    const existingPost = await Post.find({ _id: id });
    if (existingPost) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );
      if (updatedPost) {
        res.json({
          id: updatedPost._id,
          updatedPost: updatedPost,
          message: "post updated",
        });
      } else {
        res.status(402).json({ message: "failed to update" });
      }
    } else {
      res.status(403).json({ message: "Post not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});

// delete post
router.delete("/:id", authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingPost = await Post.find({ _id: id });
    if (existingPost) {
      const deletedPost = await Post.deleteOne({ _id: id });
      if (deletedPost) {
        res.json({ _id: id, message: "Post deleted" });
      } else {
        res.status(402).json({ message: "failed to delete" });
      }
    } else {
      res.status(403).json({ message: "Post not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});

// add reactions to post
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const reactions: IReactions = req.body;
    const existingPost = await Post.findOne({ _id: id });
    if (existingPost) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: id },
        {
          reactions,
        },
        {
          new: true,
        },
      );
      if (updatedPost) {
        res.json({ id: updatedPost._id, message: "reactions added" });
      } else {
        res.status(402).json({ message: "failed to add reactions" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});
