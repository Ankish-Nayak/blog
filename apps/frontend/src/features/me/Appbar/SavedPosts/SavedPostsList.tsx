import { List } from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import SavedPost from "./SavedPost";
import { useGetSavedPostsQuery } from "./savedPostsApi";
import { savedPostsAdapter } from "./savedPostSlice";
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

  const { selectAll } = savedPostsAdapter.getSelectors();

  useEffect(() => {
    if (open) {
      savedPostRefetch();
    }
  }, [open]);

  if (isSavedPostsLoading) {
    return <>Loading...</>;
  } else if (isSavedPostsSuccess && savedPosts) {
    const orderedSavedPosts = selectAll(savedPosts);
    console.log("orderedSavedPosts", orderedSavedPosts);
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
