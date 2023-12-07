import { Reaction } from "models";

const updateIsReadToFalse = async () => {
  try {
    const result = await Reaction.updateMany(
      { isRead: { $ne: false } },
      { $set: { isRead: false } },
    );

    console.log("Number of reactions updated:", result.nModified);
  } catch (error) {
    console.error("Error updating reactions:", error);
  }
};
export default updateIsReadToFalse;
