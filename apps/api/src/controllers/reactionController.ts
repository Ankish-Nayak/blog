import { NextFunction, Request, Response } from "express";
import { Post, Reaction } from "models";

export const getReactionsByLoggedInUserIdAndPostId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId, loggedInUserId } = req.query;
  if (typeof postId === "string" && typeof loggedInUserId === "string") {
    try {
      const reactions = await Reaction.find({
        postId,
        clickedBy: loggedInUserId,
      });
      const post = await Post.findOne({ _id: postId });
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
      res.json({ ...clicked, reactionsCount: post?.reactionsCount });
    } catch (e) {
      next(e);
    }
  } else {
    try {
      const reactions = await Reaction.find({});
      res.json({ reactions });
    } catch (e) {
      next(e);
    }
  }
};
