import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useDeletePostMutation } from "../postsSlice";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "../../me/loaders/CircurlarIndeterminate";

const DeletePostDialog = ({
  postId,
  open,
  setOpen,
}: {
  postId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [
    deletePost,
    { isLoading: isDeletePostLoading, isSuccess: isDeletePostSuccess },
  ] = useDeletePostMutation();

  useEffect(() => {
    if (isDeletePostSuccess) {
      navigate("/posts");
    }
  }, [isDeletePostSuccess]);
  const handleDelete = async () => {
    try {
      await deletePost({ id: postId });
    } catch (e) {
      console.log(e);
    }
  };
  if (isDeletePostLoading) {
    return <CircularIndeterminate />;
  }
  return (
    <Dialog open={open}>
      <DialogTitle>Post Deletion Confirmation</DialogTitle>
      <DialogContent>Want to delete post?</DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            setOpen(false);
          }}
        >
          No
        </Button>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog;
