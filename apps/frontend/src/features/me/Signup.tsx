import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { signUpParams, signUpTypes } from "types";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // error state.

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [signup, { isLoading, isSuccess }] = useSignupMutation();

  const dispatch = useDispatch();

  const dataValidation = useCallback(async () => {
    return new Promise<boolean>((res, rej) => {
      const data = {
        name,
        email,
        password,
      };
      const parsedData = signUpTypes.safeParse(data);
      if (!parsedData.success) {
        parsedData.error.name;
        console.log(parsedData.error.errors);
        parsedData.error.errors.map((error) => {
          ["name", "email", "password"].forEach((s) => {
            if (error.path.includes(s)) {
              switch (s) {
                case "name": {
                  setNameError(error.message);
                  break;
                }
                case "email": {
                  setEmailError(error.message);
                  break;
                }
                case "password": {
                  setPasswordError(error.message);
                  break;
                }
              }
            }
          });
        });
        rej(false);
      } else {
        res(true);
      }
    });
  }, [name, email, password]);
  const onSubmit = useCallback(async () => {
    const valid = await dataValidation();
    if (valid) {
      try {
        const data: signUpParams = {
          email,
          name,
          password,
        };
        const res = await signup(data).unwrap();
        dispatch(setCredentials({ user: res.name }));
        console.log(res);
        if (isSuccess) {
          navigate("/");
        } else if (isLoading) {
          return <p>Loading...</p>;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [
    email,
    password,
    name,
    dataValidation,
    isLoading,
    isSuccess,
    signup,
    navigate,
    dispatch,
  ]);

  return (
    <Box
      height={"85vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      padding={0}
    >
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "400px",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <CardHeader>
          <Typography variant={"h4"}>Signup</Typography>
        </CardHeader>
        <CardContent>
          <TextField
            error={nameError !== null}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            fullWidth
            label="name"
            helperText={nameError}
          />
          <TextField
            error={emailError !== null}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            fullWidth
            label="email"
            margin="normal"
            helperText={emailError}
          />
          <TextField
            type={"password"}
            error={passwordError !== null}
            value={password}
            fullWidth
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(null);
            }}
            helperText={passwordError}
            label="password"
          />
        </CardContent>
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button variant="contained" size="medium" onClick={onSubmit}>
            Signup
          </Button>
          <Button
            variant="text"
            size="medium"
            onClick={() => navigate("/login")}
          >
            Have Account
          </Button>
        </CardActionArea>
      </Card>
    </Box>
  );
};
export default Signup;
