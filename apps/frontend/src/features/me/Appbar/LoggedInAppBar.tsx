import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import UserSearch from "../UserSearch";
import TitleSearch from "../TitleSearch";
import CustomMenu from "./CustomMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
interface IPage {
  name: string;
  navigateTo: string;
}
const pages: IPage[] = [
  {
    name: "Add Post",
    navigateTo: "post",
  },
  { name: "Posts", navigateTo: "/posts" },
];
const LoggedInAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log("nav opened");
    navigate("/posts");
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        alignItems: "center",
      }}
    >
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {pages.map((page: IPage) => (
            <MenuItem key={page.name} onClick={() => navigate(page.navigateTo)}>
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "space-evenly",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          paddingTop: "5px",
        }}
      >
        {pages.map((page) => (
          <Button
            key={page.name}
            onClick={() => navigate(page.navigateTo)}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            {page.name}
          </Button>
        ))}
        {location.pathname === "/posts" && <TitleSearch />}
        {location.pathname === "/posts" && <UserSearch />}
      </Box>
      <CustomMenu />
    </div>
  );
};
export default LoggedInAppBar;
