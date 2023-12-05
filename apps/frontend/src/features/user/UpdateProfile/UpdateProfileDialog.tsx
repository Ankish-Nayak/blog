import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import UpdateProfile from "./UpdateProfile";

const UpdateProfileDialog = ({
  show,
  setOpenUpdateProfile,
}: {
  show: boolean;
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
            reset={reset}
            setReset={setReset}
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
