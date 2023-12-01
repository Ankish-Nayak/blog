import { CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../authSlice";
import { useLogoutMutation } from "../authApiSlice";

const CustomMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [logout, { isSuccess, isLoading }] = useLogoutMutation();

  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const settings: {
    name: string;
    action: () => void;
  }[] = [
    {
      name: "Profile",
      action: () => navigate("/profile"),
    },
    {
      name: "UpdateProfile",
      action: () => navigate("/UpdateProfile"),
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
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const dispatch = useDispatch();
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
      {isLoading == false && (
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Remy Sharp">A</Avatar>
          </IconButton>
        </Tooltip>
      )}
      {isLoading && (
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
