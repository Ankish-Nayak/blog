import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "./authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setCredentials } from "./authSlice";
import { useEffect } from "react";
import LoggedInAppBar from "./Appbar/LoggedInAppBar";

function ResponsiveAppBar() {
  const { data, isLoading } = useMeQuery("");

  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) dispatch(setCredentials({ user: data.name }));
  }, [data, dispatch]);

  const navigate = useNavigate();

  return (
    <AppBar position="static">
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
            onClick={() => (user ? navigate("/posts") : navigate("/login"))}
          >
            LOGO
          </Typography>
          {user && <LoggedInAppBar />}
          {isLoading && <p>Loading..</p>}
          {user === null && (
            <Box
              sx={{
                display: "flex",
                width: "100vw",
                justifyContent: "flex-end",
              }}
            >
              <Button
                sx={{
                  bgcolor: "white",
                  margin: "0 10px",
                  fontWeight: "700",
                  ":hover": { bgcolor: "white", fontWeight: "700" },
                }}
                onClick={() => {
                  navigate("/signup");
                }}
                focusRipple
              >
                Signup
              </Button>
              <Button
                sx={{
                  bgcolor: "white",
                  fontWeight: "700",
                  margin: "0 10px",
                  ":hover": { bgcolor: "white", fontWeight: "700" },
                }}
                onClick={() => {
                  navigate("/login");
                }}
                focusRipple
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
