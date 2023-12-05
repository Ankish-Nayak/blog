import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LoggedInAppBar from "./Appbar/LoggedInAppBar";
import { useMeQuery } from "./authApiSlice";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "./authSlice";

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const { data, isSuccess, isError } = useMeQuery("");
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({ user: data.name, id: data.id }));
    }
    if (isError) {
      navigate("/");
    }
  }, [data, isSuccess, isError]);
  console.log("user", user);
  console.log("pathname", location.pathname);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={() => navigate("/login")}
          >
            LOGO
          </Typography>
          {user && <LoggedInAppBar />}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
