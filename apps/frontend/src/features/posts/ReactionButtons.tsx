import { Button, Stack, Typography } from "@mui/material";
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
        <Button
          variant="contained"
          size="small"
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
          <Typography variant="button">{emoji}</Typography>
          <Typography>{post.reactions[name as IReaction]}</Typography>
        </Button>
      );
    },
  );
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"space-evenly"}
      className={"reactionButtons"}
    >
      {reactionButtons}
    </Stack>
  );
};

export default ReactionButtons;
