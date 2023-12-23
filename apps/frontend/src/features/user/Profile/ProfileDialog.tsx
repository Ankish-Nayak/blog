import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import Profile from "./Profile";

const ProfileDialog = ({
  id,
  pic,
  show,
  setOpenProfile,
}: {
  id: string;
  pic: string;
  show: boolean;
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Dialog
        onClose={() => {
          setOpenProfile(false);
        }}
        open={show}
      >
        <DialogContent>
          <Profile pic={pic} id={id} />
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
