import { List, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import SavedPost from "./SavedPost";
import { selectAllSavedPosts } from "./savedPostsApi";
import { useGetSavedPostsQuery } from "./savedPostsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
const SavedPostsList = ({
  setOpen,
  open,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    data: savedPosts,
    isLoading: isSavedPostsLoading,
    isSuccess: isSavedPostsSuccess,
    isError: isSavedPostsError,
    error: savedPostsError,
    refetch: savedPostRefetch,
  } = useGetSavedPostsQuery("");

  const orderedSavedPosts = useSelector((state: RootState) =>
    selectAllSavedPosts(state),
  );

  useEffect(() => {
    if (open) {
      savedPostRefetch();
    }
  }, [open]);

  if (isSavedPostsLoading) {
    return <>Loading...</>;
  } else if (isSavedPostsSuccess && savedPosts) {
    if (orderedSavedPosts.length === 0) {
      return <Typography>No saved Posts</Typography>;
    }
    const list = orderedSavedPosts.map((savedPost, id) => (
      <SavedPost
        key={id}
        userId={savedPost.authorId}
        postId={savedPost.postId}
        savedAt={savedPost.savedAt}
        setOpen={setOpen}
      />
    ));
    return <List>{list}</List>;
  } else if (isSavedPostsError) {
    return <>{JSON.stringify(savedPostsError)}</>;
  }
};

export default SavedPostsList;
