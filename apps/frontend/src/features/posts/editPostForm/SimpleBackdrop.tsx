import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

export default function SimpleBackdrop({ isLoading }: { isLoading: boolean }) {
  const [open, setOpen] = useState(isLoading);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isLoading) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLoading]);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
