import { NextFunction, Request, Response } from "express";
import { Notification, Post, Reaction } from "models";

export const markNotificationAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reactionId = req.params.reactionId;
  try {
    await Reaction.findByIdAndUpdate(reactionId, {
      isRead: true,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
export const getNotificationForLoggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  try {
    // Find posts for the given userId
    const posts = await Post.find({ userId }).exec();

    // Extract postIds from the found posts
    const postIds = posts.map((post) => post._id);

    // Find reactions where the postId exists in the postIds array
    const reactions = await Reaction.find({
      postId: { $in: postIds },
      isRead: false,
    })
      .populate({ path: "postId", select: "title userId" })
      .populate({
        path: "clickedBy",
        select: "name",
      })
      .select("-__v")
      .exec();
    const cleanedResult = reactions.map((doc) => doc._doc);
    res.json({ notifications: cleanedResult });
  } catch (e) {
    next(e);
  }
};

export const getNotificationCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.headers.userId as string;
  try {
    const posts = await Post.find({ userId }).exec();

    // Extract postIds from the found posts
    const postIds = posts.map((post) => post._id);

    const notificationCount = await Reaction.countDocuments({
      postId: { $in: postIds },
      isRead: false,
    });
    res.json({ notificationCount });
  } catch (e) {
    next(e);
  }
};

export const getNotifications = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notifications = await Notification.find({});
    res.json({ notifications });
  } catch (e) {
    next(e);
  }
};
