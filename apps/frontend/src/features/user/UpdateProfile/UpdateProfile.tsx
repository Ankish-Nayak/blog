import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../../users/usersSlice";
import { RootState } from "../../../app/store";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../../api/apiSlice";
import { useCallback, useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../../me/authApiSlice";
import { updateProfileTypes } from "types";
import { setCredentials } from "../../me/authSlice";

const UpdateProfile = () => {
  const id = useSelector((state: RootState) => state.auth.id);
  // const user = useSelector((state): RootState) => state.auth.user));
  const { data: user, isLoading, isSuccess } = useGetUserQuery(id as string);
  const [
    update,
    { isloading: isUpdateLoading, isSuccess: isUpdateSuccess, isError, error },
  ] = useUpdateProfileMutation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

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

          dispatch(setCredentials({ id: res.id, user: res.name }));
          setDisabled(true);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
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
