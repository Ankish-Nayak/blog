import { IPost, IReaction, useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }: { post: IPost }) => {
  const [addReaction] = useAddReactionMutation();
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([name, emoji]: [name: string, emoji: string]) => {
      return (
        <button
          key={name}
          type="button"
          onClick={() => {
            const newValue = post.reactions[name as IReaction] + 1;
            addReaction({
              postId: post.id,
              reactions: {
                ...post.reactions,
                [name]: newValue,
              },
            });
          }}
        >
          {emoji} {post.reactions[name as IReaction]}
        </button>
      );
    },
  );
  return reactionButtons;
};

export default ReactionButtons;
