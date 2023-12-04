import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../users/usersSlice";
import { RootState } from "../../../app/store";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../../api/apiSlice";

const Profile = () => {
  const id = useSelector((state: RootState) => state.auth.id);
  const { data: user, isLoading, isSuccess } = useGetUserQuery(id as string);

  console.log("link", `${BASE_URL}/profilePictures/profile/${id}`);
  if (isLoading) {
    return <CircularProgress />;
  } else if (isSuccess) {
    return (
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Card
          sx={{
            width: "550px",
            padding: "10px",
          }}
        >
          <img
            height={"200"}
            style={{
              float: "left",
              padding: "10px",
            }}
            src={`${BASE_URL}/profilePictures/profile/${id}`}
          />

          <CardContent>
            <TextField
              label={"name"}
              value={user.name}
              margin="normal"
              size="medium"
              disabled
            />

            <TextField
              label={"email"}
              margin="normal"
              value={user.email}
              disabled
            />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return <></>;
};

export default Profile;
