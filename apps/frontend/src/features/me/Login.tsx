import { useCallback, useEffect, useState } from "react";
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
import { loginParams, loginTypes } from "types";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import CircularIndeterminate from "./loaders/CircurlarIndeterminate";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();

  // error state.

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const dataValidation = useCallback(async () => {
    return new Promise<boolean>((res, rej) => {
      const data = {
        email,
        password,
      };
      const parsedData = loginTypes.safeParse(data);
      if (!parsedData.success) {
        parsedData.error.name;
        console.log(parsedData.error.errors);
        parsedData.error.errors.map((error) => {
          ["email", "password"].forEach((s) => {
            if (error.path.includes(s)) {
              switch (s) {
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
        // console.log(parsedData.error);
      } else {
        res(true);
      }
    });
  }, [email, password]);
  const onSubmit = useCallback(async () => {
    const valid = await dataValidation();
    if (valid) {
      try {
        const data: loginParams = {
          email,
          password,
        };
        const res = await login(data).unwrap();
        dispatch(setCredentials({ user: res.name }));
        if (isSuccess) {
          console.log(res);
        } else if (isLoading) {
          return <p>Loading...</p>;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [email, password, dataValidation, isLoading, isSuccess, login, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <Box
      height={"85vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      padding={0}
    >
      {isLoading && <CircularIndeterminate />}
      {!isLoading && (
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
              error={passwordError !== null}
              type={"password"}
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
              login
            </Button>
            <Button
              variant="text"
              size="medium"
              onClick={() => navigate("/signup")}
            >
              Not have Account
            </Button>
          </CardActionArea>
        </Card>
      )}
    </Box>
  );
};
export default Login;
