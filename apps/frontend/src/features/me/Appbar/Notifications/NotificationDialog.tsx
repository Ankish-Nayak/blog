import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Notifications from "./Notifications";

const NotificationDialog = ({
  openNotification,
  setOpenNotification,
}: {
  openNotification: boolean;
  setOpenNotification: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog
      open={openNotification}
      onClose={() => {
        setOpenNotification(false);
      }}
    >
      <DialogContent>
        {openNotification && <Notifications show={openNotification} />}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenNotification(false);
          }}
        >
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
