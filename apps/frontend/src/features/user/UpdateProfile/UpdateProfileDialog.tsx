import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import UpdateProfile from "./UpdateProfile";

const UpdateProfileDialog = ({
  profilePicUrl,
  show,
  setOpenUpdateProfile,
  setProfilePicUrl,
}: {
  profilePicUrl: string;
  show: boolean;
  setProfilePicUrl: Dispatch<SetStateAction<string>>;
  setOpenUpdateProfile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [reset, setReset] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
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
          setOpenUpdateProfile(false);
          console.log("closed");
        }}
        open={show}
      >
        <DialogContent>
          <UpdateProfile
            profilePicUrl={profilePicUrl}
            reset={reset}
            setReset={setReset}
            setProfilePicUrl={setProfilePicUrl}
            setUpdating={setUpdating}
          />
        </DialogContent>
        <DialogActions>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            {updating && (
              <Button onClick={() => setReset(!reset)}>reset</Button>
            )}
            <Button
              onClick={() => {
                setOpenUpdateProfile(!show);
              }}
            >
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateProfileDialog;
