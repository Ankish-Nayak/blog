import {
  Badge,
  CircularProgress,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "../../user/Profile/ProfileDialog";
import UpdateProfileDialog from "../../user/UpdateProfile/UpdateProfileDialog";
import {
  useGetProfilePicQuery,
  useLogoutMutation,
  useMeQuery,
} from "../authApiSlice";

import { RootState } from "../../../app/store";
import { logOut, setCredentials } from "../authSlice";
import NotificationDialog from "./Notifications/NotificationDialog";
import { useGetNotificationCountQuery } from "./Notifications/notificationsApi";
import SavedPostsDialog from "./SavedPosts/SavedPostsDialog";

const CustomMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [logout, { isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();
  const {
    data: profilePic,
    isLoading: isPicLoading,
    isSuccess: isPicSuccess,
    isError: isPicError,
    refetch: picRefech,
  } = useGetProfilePicQuery("");
  const { data, isLoading: isMeLoading } = useMeQuery("");

  const { data: notificationCount, isSuccess: isNotificaionCountSuccess } =
    useGetNotificationCountQuery("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) dispatch(setCredentials({ user: data.name, id: data.id }));
  }, [data, dispatch]);
  const [show, setShow] = useState(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openUpdateProfile, setOpenUpdateProfile] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openSavedPosts, setOpenSavedPosts] = useState<boolean>(false);

  const [profilePicUrl, setProfilePicUrl] = useState<string>(profilePic || "");

  const id = useSelector((state: RootState) => state.auth.id);

  useEffect(() => {
    if (isPicSuccess) {
      setProfilePicUrl(profilePic);
      // setPic(profilePic);
    }
  }, [isPicSuccess]);

  const navigate = useNavigate();
  const settings: {
    name: string;
    action: () => void;
  }[] = [
    {
      name: "Notifications",
      action: async () => {
        setOpenNotification(true);
      },
    },
    {
      name: "Profile",
      action: () => {
        setOpenProfile(true);
      },
    },
    {
      name: "UpdateProfile",
      action: () => {
        setOpenUpdateProfile(true);
      },
    },
    {
      name: "SavedPosts",
      action: () => {
        setOpenSavedPosts(true);
      },
    },
    {
      name: "Logout",
      action: async () => {
        try {
          const res = await logout("logout").unwrap();
          console.log("logout", res);
          dispatch(logOut());
        } catch (e) {
          console.log(e);
        }
      },
    },
  ];

  useEffect(() => {
    if (openUpdateProfile) {
      picRefech();
    }
  }, [openUpdateProfile]);
  useEffect(() => {
    if (isLogoutSuccess) {
      dispatch(logOut());
      navigate("/");
    }
  }, [isLogoutSuccess, navigate]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setShow(!show);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setShow(false);
    setAnchorElUser(null);
  };
  return (
    <Box sx={{ flexGrow: 0 }}>
      <UpdateProfileDialog
        show={openUpdateProfile}
        setOpenUpdateProfile={setOpenUpdateProfile}
        profilePicUrl={profilePicUrl}
        setProfilePicUrl={setProfilePicUrl}
      />
      <Profile
        id={id as string}
        show={openProfile}
        setOpenProfile={setOpenProfile}
        pic={profilePicUrl}
      />
      <NotificationDialog
        setOpenNotification={setOpenNotification}
        openNotification={openNotification}
      />
      <SavedPostsDialog setOpen={setOpenSavedPosts} open={openSavedPosts} />
      {isLogoutLoading === false && isMeLoading === false && (
        <Tooltip title="Open settings">
          {/* <Badge badgeContent={4}> */}
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            {isPicLoading && <Skeleton variant="rounded"></Skeleton>}

            {isPicSuccess && (
              <Badge
                badgeContent={isNotificaionCountSuccess ? notificationCount : 9}
                color={"secondary"}
              >
                <Avatar alt="Remy Sharp" src={profilePicUrl}></Avatar>
              </Badge>
            )}
            {isPicError && (
              <Badge
                badgeContent={isNotificaionCountSuccess ? notificationCount : 9}
                color={"secondary"}
              >
                <Avatar alt={data.name}>{data.name[0].toUpperCase()}</Avatar>
              </Badge>
            )}
          </IconButton>
          {/* </Badge> */}
        </Tooltip>
      )}
      {(isLogoutLoading || isMeLoading || isPicLoading) && (
        <CircularProgress
          sx={{
            color: "whitesmoke",
          }}
        />
      )}

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={show}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.name}
            onClick={() => {
              setShow(!show);
              setting.action();
            }}
          >
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
export default CustomMenu;
