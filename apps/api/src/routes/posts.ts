import express from "express";
import { Request, Response } from "express";
import { IPost, Post } from "../models";

export const router = express.Router();

// get all posts
router.get("/", async (_, res: Response) => {
  try {
    const posts = await Post.find({});
    return res.json({ posts: posts, message: "updated new" });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: "internal error" });
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
    return res.json({ id: newPost._id, message: "post created" });
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
        res.json({ deletedPost, message: "Post deleted" });
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
