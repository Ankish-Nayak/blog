import { NextFunction, Request, Response } from "express";
import { Notification, Post, Reaction } from "models";

export const markNotificationAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reactionId = req.params;
  try {
    await Reaction.findByIdAndUpdate(reactionId, {
      isRead: true,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const notNull = (value: any) => {
  return value !== null;
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
      .exec();
    res.json({ notifications: reactions });
    // const resReactions = reactions.map((reaction) => {
    //   return {};
    // });
    //
    // const notifications = await Notification.find({
    //   authorId: userId,
    // }).populate({
    //   path: "reactionId",
    //   populate: {
    //     path: "clickedBy",
    //   },
    // });
    // const resNotifications = notifications
    //   .map((notification) => {
    //     return {
    //       clickedByName: notification.reactionId.clickedBy.name,
    //       clickedAt: notification.reactionId.clickedAt,
    //       postId: notification.reactionId.postId,
    //       clickedBy: notification.reactionId.clickedBy._id,
    //       authorId: notification.authorId,
    //       reactionType: notification.reactionId.reactionType,
    //     };
    //   })
    //   .filter(
    //     //  filter to make not include the authorid who himself likes the post
    //     (notification) =>
    //       notification.authorId.toString() !==
    //       notification.clickedBy.toString(),
    //   );
    // res.json({ notifications: resNotifications });
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
    const notificationCount = await Notification.countDocuments({
      authorId: userId,
    });
    res.json({ notificationCount });
  } catch (e) {
    next(e);
  }
};

export const getNotifications = async (
  req: Request,
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
