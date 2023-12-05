import express, { Request, Response } from "express";
import { IncomingHttpHeaders } from "http2";
import { IPost, Post, Reaction, User } from "models";
import { Document, Types } from "mongoose";
import { addReactionType } from "types";
import { authenticateJwt } from "../middlewares/auth";

interface MRequest extends Request {
  headers: IncomingHttpHeaders | { userId: string; name: string };
}
export const router = express.Router();

export const newPost = async (
  posts: (Document<unknown, {}, IPost> &
    IPost & {
      _id: Types.ObjectId;
    })[],
  userId: string,
) => {
  return await Promise.all(
    posts.map(async (post) => {
      return new Promise(async (res) => {
        const reactions = await Reaction.find({
          postId: post._id,
          clickedBy: userId,
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
        res({
          id: post._id,
          userId: post.userId,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          reactions: post.reactions,
          clicked: clicked,
          reactionsCount: post.reactionsCount,
        });
      });
    }),
  );
};

// get all posts and get by userId
router.get("/", authenticateJwt, async (req: MRequest, res: Response) => {
  const userId: string = req.headers.userId as string;
  if (typeof req.query.userId === "string") {
    try {
      const userId: string = req.query.userId;
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        const posts = await Post.find({ userId: existingUser._id });
        if (posts) {
          res.json({
            posts: newPost(posts, userId),
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
        return res.json({ posts: await newPost(posts, userId) });
      } else {
        const posts = await Post.find({ userId: { $in: ids } });
        return res.json({ posts: await newPost(posts, userId) });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else if (typeof req.query.title === "string") {
    const posts = await Post.find({
      title: { $regex: req.query.title, $options: "i" },
    });
    res.json({ posts: await newPost(posts, userId) });
  } else {
    try {
      const posts = await Post.find({});
      return res.json({
        posts: await newPost(posts, userId),
        message: "updated new",
      });
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
    res.status(500).json({ message: "internal error" });
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
router.put("/:id", authenticateJwt, async (req: MRequest, res: Response) => {
  const userId: string = req.headers.userId as string;
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
          updatedPost: (await newPost([updatedPost], userId))[0],
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
