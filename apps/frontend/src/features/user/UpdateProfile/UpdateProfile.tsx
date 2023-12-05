import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileTypes } from "types";
import { RootState } from "../../../app/store";
import { BASE_URL } from "../../api/apiSlice";
import {
  useGetProfilePicQuery,
  useUpdateProfileMutation,
} from "../../me/authApiSlice";
import { setCredentials } from "../../me/authSlice";
import { useGetUserQuery } from "../../users/usersSlice";

// TODO: make useState which can be used know whether data is
// changed or not so that we can render reset button in accordance to that
//

const UpdateProfile = ({
  reset,
  setUpdating,
  setReset,
}: {
  reset: boolean;
  setUpdating: Dispatch<SetStateAction<boolean>>;
  setReset: Dispatch<SetStateAction<boolean>>;
}) => {
  const id = useSelector((state: RootState) => state.auth.id);
  // const user = useSelector((state): RootState) => state.auth.user));
  const { data: user, isLoading, isSuccess } = useGetUserQuery(id as string);
  const [update] = useUpdateProfileMutation();
  const {
    data: pic,
    isSuccess: isPicSuccess,
    isLoading: isPicLoading,
  } = useGetProfilePicQuery("");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>(
    // `${BASE_URL}/profilePictures/profile/${id}`,
    pic || "",
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  // const init = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${BASE_URL}/profilePictures/profile/protected`,
  //       {
  //         withCredentials: true,
  //       },
  //     );
  //     const data = res.data;
  //     const contentType = data.photo.contentType;
  //     const bufferData = data.photo.data.data;
  //     setProfilePic(
  //       `data:${contentType};base64, ${Buffer.from(bufferData).toString(
  //         "base64",
  //       )}`,
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  //
  // useEffect(() => {
  //   init();
  // }, []);

  const originalState = () => {
    if (isSuccess) {
      setName(user.name);
      setEmail(user.email);
      setProfilePic(pic || "");
      setDisabled(true);
      setNameError(null);
      setEmailError(null);
      setShowToolTip(false);
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (reset) {
      originalState();
      setReset(false);
    }
  }, [reset]);

  const dataValidation = useCallback(async () => {
    return new Promise<boolean>((res, rej) => {
      const data = {
        email,
        name,
      };
      const parsedData = updateProfileTypes.safeParse(data);
      if (!parsedData.success) {
        parsedData.error.name;
        console.log(parsedData.error.errors);
        parsedData.error.errors.map((error) => {
          ["email", "name"].forEach((s) => {
            if (error.path.includes(s)) {
              switch (s) {
                case "email": {
                  setEmailError(error.message);
                  break;
                }
                case "name": {
                  setNameError(error.message);
                  break;
                }
              }
            }
          });
        });
        rej(false);
        // console.log(parsedData.error);
      } else {
        res(true);
      }
    });
  }, [email, name]);

  useEffect(() => {
    if (isSuccess) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isSuccess]);
  const dispatch = useDispatch();
  const handleEditButton = async () => {
    if (!id) {
      throw Error("user not loggedIn");
    }
    if (!disabled) {
      const valid = await dataValidation();
      if (valid) {
        try {
          const res = await update({
            name,
            email,
            userId: id,
          }).unwrap();
          setUpdating(false);
          dispatch(setCredentials({ id: res.id, user: res.name }));
          setDisabled(true);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      setUpdating(true);
      setShowToolTip(true);
      setDisabled(false);
    }
  };

  console.log("link", `${BASE_URL}/profilePictures/profile/${id}`);
  if (isLoading) {
    return <p>Loading...</p>;
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
              <label htmlFor="upload-image">
                {isPicLoading && <Skeleton variant="circular"></Skeleton>}
                {isPicSuccess && (
                  <Tooltip
                    title="click on image to change it"
                    open={showToolTip}
                    onClose={() => {
                      setShowToolTip(false);
                    }}
                  >
                    <Tooltip title="click to change profile">
                      <Avatar
                        sx={{
                          height: "175px",
                          width: "175px",
                        }}
                        src={profilePic}
                      />
                    </Tooltip>
                  </Tooltip>
                )}
              </label>
              <label htmlFor="upload-image">
                <input
                  type="file"
                  hidden
                  id="upload-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfilePic(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </Box>

            <Box display="flex" flexDirection={"column"}>
              <CardContent>
                <TextField
                  label={"name"}
                  error={nameError !== null}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(null);
                  }}
                  margin="normal"
                  size="medium"
                  disabled={disabled}
                  helperText={nameError}
                />

                <TextField
                  label={"email"}
                  error={emailError !== null}
                  margin="normal"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                  }}
                  helperText={emailError}
                  disabled={disabled}
                />
              </CardContent>
            </Box>
          </Box>{" "}
          <CardActionArea sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              size={"small"}
              variant={"contained"}
              onClick={handleEditButton}
              sx={{
                margin: "0 auto",
              }}
            >
              {disabled ? "Edit" : "update Profile"}
            </Button>
          </CardActionArea>
        </Card>
      </Box>
    );
  }

  return <></>;
};

export default UpdateProfile;
