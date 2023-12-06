import { Post } from "models";
import { win32 } from "path";

// Assuming you have a MongoDB connection, you can use the following code to update negative reaction counts

async function updateNegativeReactions() {
  const result = await Post.updateMany(
    {
      $or: [
        { "reactionsCount.thumbsUp": { $lt: 0 } },
        { "reactionsCount.heart": { $lt: 0 } },
        { "reactionsCount.wow": { $lt: 0 } },
        { "reactionsCount.rocket": { $lt: 0 } },
        { "reactionsCount.coffee": { $lt: 0 } },
      ],
    },
    [
      {
        $set: {
          "reactionsCount.thumbsUp": { $abs: "$reactionsCount.thumbsUp" },
          "reactionsCount.heart": { $abs: "$reactionsCount.heart" },
          "reactionsCount.wow": { $abs: "$reactionsCount.wow" },
          "reactionsCount.rocket": { $abs: "$reactionsCount.rocket" },
          "reactionsCount.coffee": { $abs: "$reactionsCount.coffee" },
        },
      },
    ],
  );

  console.log(`${result.nModified} documents updated`);
}

// Call the function to update negative reaction counts
export default updateNegativeReactions;
