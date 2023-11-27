import express from "express";
import { Request, Response } from "express";
import { IPost, IReactions, Post, User } from "../models";

export const router = express.Router();

// get all posts and get by userId
router.get("/", async (req: Request, res: Response) => {
  console.log("get all post", req.query);
  if (typeof req.query.userId === "string") {
    try {
      const userId: string = req.query.userId;
      console.log(req.query);
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
router.post("/", async (req: Request, res: Response) => {
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
router.put("/:id", async (req: Request, res: Response) => {
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
router.delete("/:id", async (req: Request, res: Response) => {
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
