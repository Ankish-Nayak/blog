import { Grid } from "@mui/material";
import Login from "../features/me/Login";
import { useState } from "react";
import Signup from "../features/me/Signup";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  if (user) {
    navigate("/posts");
  }
  return (
    <Grid container height={"85vh"}>
      <Grid
        item
        xs={6}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <img
          src="/blog.webp"
          style={{
            width: "650px",
          }}
        />
      </Grid>
      <Grid item xs={6}>
        {haveAccount ? (
          <Login setHaveAccount={setHaveAccount} />
        ) : (
          <Signup setHaveAccount={setHaveAccount} />
        )}
      </Grid>
    </Grid>
  );
};
export default HomePage;
