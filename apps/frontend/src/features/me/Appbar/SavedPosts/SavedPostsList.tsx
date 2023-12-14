import { List } from "@mui/material";
import { useGetSavedPostsQuery } from "../../../posts/postsSlice";
import SavedPost from "./SavedPost";
import { Dispatch, SetStateAction, useEffect } from "react";
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

  useEffect(() => {
    if (open) {
      savedPostRefetch();
    }
  }, [open]);

  if (isSavedPostsLoading) {
    return <>Loading...</>;
  } else if (isSavedPostsSuccess && savedPosts) {
    const list = savedPosts.map((savedPost) => (
      <SavedPost
        key={savedPost.postId}
        savedPost={savedPost}
        setOpen={setOpen}
      />
    ));
    return <List>{list}</List>;
  } else if (isSavedPostsError) {
    return <>{JSON.stringify(savedPostsError)}</>;
  }
};

export default SavedPostsList;
