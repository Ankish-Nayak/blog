import { Notification, Reaction } from "models";
const removeNotificationsWithoutReaction = async () => {
  try {
    // Find all notifications with a reactionId that doesn't exist in the Reaction collection
    const notificationsToRemove = await Notification.find({
      reactionId: { $nin: await Reaction.distinct("_id") },
    }).exec();

    // Extract the IDs of notifications to be removed
    const notificationIdsToRemove = notificationsToRemove.map(
      (notification) => notification._id,
    );

    // Remove the notifications
    const result = await Notification.deleteMany({
      _id: { $in: notificationIdsToRemove },
    });

    console.log(`${result.deletedCount} notifications removed successfully.`);
  } catch (error) {
    console.error("Error removing notifications:", error);
  }
};

// Example usage:

export default removeNotificationsWithoutReaction;
