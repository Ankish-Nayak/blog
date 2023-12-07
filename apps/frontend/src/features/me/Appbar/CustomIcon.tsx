import { Badge, Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MouseEvent } from "react";
const CustomIcon = ({
  isPicLoading,
  isPicSuccess,
  isPicError,
  profilePicUrl,
  handleOpenUserMenu,
  data,
}: {
  isPicLoading: boolean;
  isPicSuccess: boolean;
  isPicError: boolean;
  profilePicUrl: string;
  handleOpenUserMenu: MouseEvent<HTMLElement>;
}) => {
  return (
    <Tooltip title="Open settings">
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        {isPicLoading && <Skeleton variant="rounded"></Skeleton>}
        {isPicSuccess && (
          <Badge badgeContent={4} color={"secondary"}>
            <Avatar alt="Remy Sharp" src={profilePicUrl}></Avatar>
          </Badge>
        )}
        {isPicError && (
          <Avatar alt={data.name}>{data.name[0].toUpperCase()}</Avatar>
        )}
      </IconButton>
    </Tooltip>
  );
};
