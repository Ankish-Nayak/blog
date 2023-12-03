import express from "express";
import { Request, Response } from "express";
import { IPost, IReactions, Post, User, Reaction } from "models";
import { authenticateJwt } from "../middlewares/auth";
import { addReactionType } from "types";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export const router = express.Router();

export const newPost = (posts: IPost[]) => {
  // {reactions: _,...resPost} = post;
  return posts;
  // return posts.map((post) => {
  //   const { reactions: _, ...resPost } = post;
  //   return resPost;
  // return {
  //   title: post.title,
  //   content: post.content,
  //   createdAt: post.createdAt,
  //   updatedAt: post.updatedAt,
  //   reactions: {
  //     thumbsUp: post.reactions.thumbsUp.length,
  //     heart: post.reactions.heart.length,
  //     rocket: post.reactions.rocket.length,
  //     wow: post.reactions.wow.length,
  //     coffee: post.reactions.coffee.length,
  //   },
  // };
  // });
};

// get all posts and get by userId
router.get("/", authenticateJwt, async (req: Request, res: Response) => {
  if (typeof req.query.userId === "string") {
    try {
      const userId: string = req.query.userId;
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        const posts = await Post.find({ userId: existingUser._id });
        if (posts) {
          res.json({
            posts: newPost(posts),
          });
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
        return res.json({ posts: newPost(posts) });
      } else {
        const posts = await Post.find({ userId: { $in: ids } });
        return res.json({ posts: newPost(posts) });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else if (typeof req.query.title === "string") {
    const posts = await Post.find({
      title: { $regex: req.query.title, $options: "i" },
    });
    res.json({ posts: newPost(posts) });
  } else {
    try {
      const posts = await Post.find({});
      return res.json({ posts: newPost(posts), message: "updated new" });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "internal error" });
    }
  }
});

router.get("/title/", authenticateJwt, async (req: Request, res: Response) => {
  try {
    const regex = req.query.regex;
    if (typeof regex === "string" && regex.length !== 0) {
      console.log("regex", regex);
      const titles = await Post.find({
        title: { $regex: regex, $options: "i" },
      });
      res.json({ titles });
    } else {
      const titles = await Post.find({});
      res.json({ titles });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "interna error" });
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
// get one post
router.get("/:id", authenticateJwt, async (req: Request, res: Response) => {
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

router.patch("/:id", authenticateJwt, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const parsedInputs = addReactionType.safeParse(req.body);
    if (!parsedInputs.success) {
      return res.status(411).json({ error: parsedInputs.error });
    }
    const { clickedBy, postId, reactionType } = parsedInputs.data;
    const existingPost = await Post.findOne({ _id: id });
    if (existingPost) {
      const existingReaction = await Reaction.findOne({ postId, reactionType });
      if (existingReaction) {
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          {
            $pull: {
              reactions: existingReaction._id,
            },
          },
          {
            new: true,
          },
        );
        if (updatedPost) {
          updatedPost.reactionsCount[reactionType]--;
          await updatedPost.save();
        }

        await Reaction.findOneAndDelete({
          postId,
          reactionType,
        });
        const reactions = await Reaction.find({
          postId,
          clickedBy,
        });
        const clicked = {
          thumbsUp: false,
          wow: false,
          rocket: false,
          coffee: false,
          heart: false,
        };
        reactions.forEach((reaction) => {
          clicked[reaction.reactionType] = true;
        });
        res.json({
          message: "reaction Removed",
          added: false,
          reactionsCount: updatedPost?.reactionsCount,
          clicked,
        });
      } else {
        const newReaction = await Reaction.create({
          clickedBy,
          clickedAt: Date.now(),
          postId,
          reactionType,
        });
        const existingPost = await Post.findOne({ _id: postId });
        if (existingPost && newReaction) {
          if (existingPost.reactions) {
            existingPost.reactions.push(newReaction._id);
          } else {
            existingPost.reactions = [newReaction._id];
          }
          existingPost.reactionsCount[reactionType]++;
          await existingPost.save();
          const reactions = await Reaction.find({
            postId,
            clickedBy,
          });
          const clicked = {
            thumbsUp: false,
            wow: false,
            rocket: false,
            coffee: false,
            heart: false,
          };
          reactions.forEach((reaction) => {
            clicked[reaction.reactionType] = true;
          });
          res.json({
            added: true,
            reactionsCount: existingPost.reactionsCount,
            clicked,
          });
        } else {
          res.json({ added: true, message: "post dose not exists" });
        }
      }
    } else {
      res.status(402).json({ message: "invalid postId" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});
