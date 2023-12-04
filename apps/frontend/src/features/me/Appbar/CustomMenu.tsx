import { CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut, setCredentials } from "../authSlice";
import { useLogoutMutation, useMeQuery } from "../authApiSlice";
import Profile from "../../user/Profile/ProfileDialog";
import UpdateProfileDialog from "../../user/UpdateProfile/UpdateProfileDialog";

const CustomMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [logout, { isSuccess, isLoading }] = useLogoutMutation();
  const { data, isLoading: isMeLoading } = useMeQuery("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) dispatch(setCredentials({ user: data.name, id: data.id }));
  }, [data, dispatch]);
  const [show, setShow] = useState(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openUpdateProfile, setOpenUpdateProfile] = useState<boolean>(false);

  const navigate = useNavigate();
  const settings: {
    name: string;
    action: () => void;
  }[] = [
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
      name: "Logout",
      action: async () => {
        try {
          await logout("logout").unwrap();
          dispatch(logOut());
        } catch (e) {
          console.log(e);
        }
        console.log("logout");
      },
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

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
      />
      <Profile show={openProfile} setOpenProfile={setOpenProfile} />
      {isLoading === false && isMeLoading === false && (
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Remy Sharp">A</Avatar>
          </IconButton>
        </Tooltip>
      )}
      {(isLoading || isMeLoading) && (
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
