import { Button, Stack, Typography } from "@mui/material";
import { IPost, IReaction, useAddReactionMutation } from "./postsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addReactionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/apiSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }: { post: IPost }) => {
  const loggedInUser = useSelector((state: RootState) => state.auth);
  // const {data: user} = useMeQuery("");
  const [addReaction] = useAddReactionMutation();
  const [reactions, setReactions] = useState<{
    thumbsUp: boolean;
    wow: boolean;
    rocket: boolean;
    coffee: boolean;
    heart: boolean;
  }>({
    thumbsUp: false,
    wow: false,
    rocket: false,
    coffee: false,
    heart: false,
  });
  const [reactionsCount, setReactionsCount] = useState<{
    thumbsUp: number;
    wow: number;
    rocket: number;
    coffee: number;
    heart: number;
  }>({
    thumbsUp: 0,
    wow: 0,
    rocket: 0,
    coffee: 0,
    heart: 0,
  });

  const init = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/reactions/?postId=${post.id}&loggedInUserId=${loggedInUser.id}`,
      );
      const data = res.data;
      if (data) {
        // console.log(data);
        setReactions({
          heart: data.heart,
          thumbsUp: data.thumbsUp,
          coffee: data.coffee,
          rocket: data.rocket,
          wow: data.wow,
        });
        setReactionsCount({
          ...data.reactionsCount,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (post.title === "new Post") console.log(reactions);

  useEffect(() => {
    init();
  }, []);

  const handleAddReaction = async (
    reactionType: IReaction,
    // reactionCount: number,
  ) => {
    if (loggedInUser.id === null) {
      throw new Error("not logged in");
    }
    console.log(reactionType);
    // setReactions((prev) => {
    //   const d = prev;
    //   d[reactionType] = !prev[reactionType];
    //   return d;
    //   // return {
    //   //   ...prev,
    //   //   reactionType: !prev[reactionType],
    //   // };
    // });
    try {
      const data: addReactionParams = {
        reactionType,
        clickedBy: loggedInUser.id,
        postId: post.id,
      };
      console.log(reactionType);

      // reactions[reactionType] ? reactionCount++ : reactionCount--;
      const res = await addReaction(data).unwrap();
      setReactionsCount({
        ...res.reactionsCount,
      });
      console.log("res", res);
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
