import { Grid } from "@mui/material";
import Login from "../features/me/Login";
import { useState } from "react";
import Signup from "../features/me/Signup";

const HomePage = () => {
  const [haveAccount, setHaveAccount] = useState<boolean>(true);
  // const { data: user, isLoading,
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (isSuccess && typeof user !== "undefined") {
  //     navigate("/posts");
  //   }
  // }, [isSuccess]);
  // if (isLoading) {
  //   return <CircularIndeterminate />;
  // }
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
