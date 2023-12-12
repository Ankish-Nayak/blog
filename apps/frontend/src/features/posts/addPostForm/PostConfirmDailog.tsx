import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const PostConfirmDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>Post has been created.</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostConfirmDialog;
