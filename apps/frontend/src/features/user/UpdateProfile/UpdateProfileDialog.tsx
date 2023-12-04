import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import UpdateProfile from "./UpdateProfile";

const UpdateProfileDialog = ({
  show,
  setOpenUpdateProfile,
}: {
  show: boolean;
  setOpenUpdateProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Button
        onClick={() => {
          setOpenUpdateProfile(!show);
        }}
      >
        Open
      </Button>
      <Dialog
        onClose={() => {
          console.log("closed");
        }}
        open={show}
      >
        <DialogContent>
          <UpdateProfile />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenUpdateProfile(!show);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateProfileDialog;
