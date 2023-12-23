import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../../api/apiSlice";
import { useGetUserQuery } from "../../users/usersSlice";

const Profile = ({ pic, id }: { pic: string; id: string }) => {
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
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Box
              flexDirection="column"
              padding={"10px"}
              justifyContent={"center"}
              alignContent={"flex-end"}
              alignItems={"center"}
            >
              <Avatar
                sx={{
                  height: "175px",
                  width: "175px",
                }}
                src={pic}
              />
            </Box>

            <Box display="flex" flexDirection={"column"}>
              <CardContent>
                <TextField
                  label={"name"}
                  value={user.name}
                  margin="normal"
                  size="medium"
                  disabled
                />

                <TextField label={"email"} value={user.email} disabled />
              </CardContent>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }

  return <></>;
};

export default Profile;
