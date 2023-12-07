import { IPost, Reaction } from "models";
import { Document, Types } from "mongoose";
const transformPost = async (
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
export default transformPost;
