import { NextFunction, Request, Response } from "express";
import { Post, Reaction, User, Notification } from "models";
import { addReactionType, createPostTypes, updatePostTypes } from "types";
import transformPost from "../helpers/transformPost";
import { exit } from "process";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId: string = req.headers.userId as string;
  try {
    const parsedInputs = createPostTypes.parse(req.body);
    const { title, content } = parsedInputs;
    const newPost = new Post({
      title,
      content,
      userId,
    });
    await newPost.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: { posts: newPost._id },
    });
    return res.json({ _id: newPost._id, message: "post created" });
  } catch (e) {
    next(e);
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  try {
    const posts = await Post.find({});
    return res.json({
      posts: await transformPost(posts, userId),
      message: "updated new",
    });
  } catch (e) {
    next(e);
  }
};

export const getPostCountByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.query.userId as string;
  try {
    const postCount = await Post.countDocuments({ userId });
    return res.json({ userId, postCount });
  } catch (e) {
    next(e);
  }
};

export const getPostsByAuthorName = async (
  name: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  try {
    const users = await User.find({ name: name });
    const ids = users.map((user) => user._id.toString());
    console.log(ids);
    if (typeof req.query.title === "string") {
      const posts = await Post.find({
        userId: { $in: ids },
        title: { $regex: req.query.title, $options: "i" },
      });
      return res.json({ posts: await transformPost(posts, userId) });
    } else {
      const posts = await Post.find({ userId: { $in: ids } });
      return res.json({ posts: await transformPost(posts, userId) });
    }
  } catch (e) {
    next(e);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId: string = req.headers.userId as string;
  const postId = req.params.id;
  try {
    const parsedInputs = updatePostTypes.parse(req.body);
    const { title, content } = parsedInputs;
    const existingPost = await Post.find({ _id: postId });
    if (existingPost) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { title, content },
        { new: true },
      );
      if (updatedPost) {
        res.json({
          id: updatedPost._id,
          updatedPost: (await transformPost([updatedPost], userId))[0],
          message: "post updated",
        });
      } else {
        res.status(402).json({ message: "failed to update" });
      }
    } else {
      res.status(403).json({ message: "Post not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const getPostsByAuthorId = async (
  authorId: string,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await User.findOne({ _id: authorId });
    if (existingUser) {
      const posts = await Post.find({ userId: existingUser._id });
      if (posts) {
        res.json({
          posts: transformPost(posts, authorId),
        });
      } else {
        res.status(402).json({ message: "posts dose not exists" });
      }
    } else {
      res.status(403).json({ message: "User dose not exists" });
    }
  } catch (e) {
    next(e);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const post = await Post.findOne({ _id: id });
    if (post) {
      return res.json({ post });
    } else {
      return res.status(403).json({ message: "Post not found" });
    }
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
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
    next(e);
  }
};

export const addReactionToPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const parsedInputs = addReactionType.parse(req.body);
    const { clickedBy, postId, reactionType } = parsedInputs;
    const existingPost = await Post.findOne({ _id: id });
    if (existingPost) {
      const existingReaction = await Reaction.findOne({
        postId,
        reactionType,
        clickedBy,
      });
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
        await Notification.findOneAndDelete({
          reactionId: existingReaction._id,
        });
        console.log("notification deleted");
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

          // create Notification
          const notification = await Notification.create({
            reactionId: newReaction._id,
            postId: existingPost._id,
            authorId: existingPost.userId,
          });
          await notification.save();
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
    next(e);
  }
};

export const getPostTitles = async (
  // title: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(e);
  }
};

export const getPostsByTitle = async (
  title: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId: string = req.headers.userId as string;
    const posts = await Post.find({
      title: { $regex: title, $options: "i" },
    });
    res.json({ posts: await transformPost(posts, userId) });
  } catch (e) {
    next(e);
  }
};

// module.exports = {
//   getAllPosts,
//   getPostById,
//   getPostsByAuthorName,
//   getPostsByAuthorId,
//   createPost,
//   deletePost,
//   updatePost,
//   addReactionType,
// };
