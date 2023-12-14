import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import SavedPostsList from "./SavedPostsList";

const SavedPostsDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <SavedPostsList setOpen={setOpen} open={open} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedPostsDialog;
