import { User, Post } from "models";
const addMissingPostIds = async () => {
  try {
    // Find all users
    const users = await User.find({});

    // Iterate over each user
    for (const user of users) {
      // Find post IDs that exist in the Post collection for the corresponding userId
      const existingPostIds = await Post.find({
        userId: user._id,
      }).distinct("_id");

      // Find post IDs that are not currently in the user's posts array
      const missingPostIds = existingPostIds.filter(
        (postId) => !user.posts.includes(postId),
      );

      // Update the user's posts field by adding missing post IDs
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { posts: { $each: missingPostIds } },
      });
    }

    console.log("Missing post IDs added to user posts fields successfully.");
  } catch (error) {
    console.error("Error adding missing post IDs:", error);
  }
};

export default addMissingPostIds;
