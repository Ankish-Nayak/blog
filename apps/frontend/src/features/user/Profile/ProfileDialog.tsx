import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import Profile from "./Profile";

const ProfileDialog = ({
  show,
  setOpenProfile,
}: {
  show: boolean;
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Button
        onClick={() => {
          setOpenProfile(!show);
        }}
      >
        Open
      </Button>
      <Dialog
        onClose={() => {
          setOpenProfile(false);
        }}
        open={show}
      >
        <DialogContent>
          <Profile />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenProfile(!show);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
