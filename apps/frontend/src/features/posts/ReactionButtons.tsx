import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IPost, IReaction, useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

// TODO: make navbar much more better ui/ux

// TODO: refactor backend routes in accordannce to url design patterns
const ReactionButtons = ({ post }: { post: IPost }) => {
  const loggedInUser = useSelector((state: RootState) => state.auth);
  const [addReaction] = useAddReactionMutation();
  const [reactions, setReactions] = useState<{
    thumbsUp: boolean;
    wow: boolean;
    rocket: boolean;
    coffee: boolean;
    heart: boolean;
  }>({
    ...post.clicked,
  });
  const [reactionsCount, setReactionsCount] = useState<{
    thumbsUp: number;
    wow: number;
    rocket: number;
    coffee: number;
    heart: number;
  }>({ ...post.reactionsCount });

  if (post.title === "new Post") console.log(reactions);

  const handleAddReaction = async (reactionType: IReaction) => {
    if (loggedInUser.id === null) {
      throw new Error("not logged in");
    }

    try {
      const data = {
        reactionType,
        clickedBy: loggedInUser.id,
        postId: post.id,
        reactionsCount,
        clicked: reactions,
      };
      const res = await addReaction(data).unwrap();
      setReactionsCount({ ...res.reactionsCount });
      setReactions({
        ...res.clicked,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([name, emoji]: [name: string, emoji: string]) => {
      return (
        <Button
          variant="contained"
          size="small"
          key={name}
          type="button"
          color={reactions[name as IReaction] ? "success" : "warning"}
          onClick={() => handleAddReaction(name as IReaction)}
        >
          <Typography variant="button">{emoji}</Typography>
          <Typography>{reactionsCount[name as IReaction]}</Typography>
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
