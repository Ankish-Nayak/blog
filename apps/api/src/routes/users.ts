import express, { Request, Response } from "express";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { loginTypes, signUpTypes } from "types";
import { Post, User } from "models";
import { authenticateJwt } from "../middlewares/auth";
import { config } from "dotenv";
import { refreshLoginSession } from "../helpers/removeExpiryToken";
config();
export const router = express.Router();

// me
router.get("/me", authenticateJwt, async (req: Request, res: Response) => {
  console.log(req.headers);
  const name = req.headers.name;
  if (typeof name === "undefined") {
    res.status(403).json({ message: "user not logged in" });
  } else {
    res.json({ id: req.headers["userId"], name, message: "found" });
  }
});

// login route for user
router.post("/login", async (req: Request, res: Response) => {
  const secret = process.env.SECRET;
  if (typeof secret === "undefined") {
    console.log("secret not found");
    return res.status(500).json({ message: "internal error" });
  }
  const parsedInput = loginTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { email, password } = parsedInput.data;
  try {
    const existingUser = await User.findOne({ email, password });
    if (existingUser) {
      const token = jwt.sign(
        { name: existingUser.name, userId: existingUser._id },
        secret,
        {
          expiresIn: "1h",
        },
      );
      existingUser.loginSessions.push(token);
      existingUser.loginSessions = await refreshLoginSession(
        "",
        secret,
        existingUser.loginSessions,
      );
      await existingUser.save();
      const cookies = new Cookies(req, res);
      cookies.set("user-token", token);
      res.json({
        message: "user loggedIn",
        name: existingUser.name,
        id: existingUser._id,
      });
    } else {
      res.status(403).json({ message: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});

// sign up route for user
router.post("/signup", async (req: Request, res: Response) => {
  const secret = process.env.SECRET;
  if (typeof secret === "undefined") {
    console.log("secret not found");
    return res.status(500).json({ message: "internal error" });
  }
  const parsedInput = signUpTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { name, email, password } = parsedInput.data;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(403).json({ message: "email taken" });
    } else {
      const newUser = await User.create({ name, email, password });
      if (newUser) {
        const token = jwt.sign({ name, userId: newUser._id }, secret, {
          expiresIn: "1h",
        });
        const cookies = new Cookies(req, res);
        cookies.set("user-token", token);
        newUser.loginSessions.push(token);
        await newUser.save();
        res.json({
          message: "user creaed",
          name: newUser.name,
          id: newUser._id,
        });
      } else {
        res.status(402).json({ message: "failed to create" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "internal error" });
  }
});

// update profile
router.post(
  "/profile",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const secret = process.env.SECRET;
    const userId = req.headers["userId"];
    if (typeof secret === "undefined") {
      console.log("secret not found");
      return res.status(500).json({ message: "internal error" });
    }
    const parsedInput = signUpTypes.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ error: parsedInput.error });
    }
    const { name, email, password } = parsedInput.data;
    try {
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        const emailUser = await User.findOne({ email });
        // check for email eonfict
        if (
          emailUser &&
          emailUser._id.toString() !== existingUser._id.toString()
        ) {
          res.status(402).json({ message: "email already taken" });
        } else {
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
              name,
              email,
              password,
            },
            { new: true },
          );
          if (updatedUser) {
            const token = jwt.sign({ name, userId: updatedUser._id }, secret, {
              expiresIn: "1h",
            });
            const cookies = new Cookies(req, res);
            cookies.set("user-token", token);
            updatedUser.loginSessions = await refreshLoginSession(
              "",
              secret,
              existingUser.loginSessions,
            );
            updatedUser.loginSessions.push(token);
            await updatedUser.save();
            res.json({ message: "profile updated", name, id: updatedUser._id });
          } else {
            res.status(402).json({ message: "failed to update" });
          }
        }
      } else {
        res.status(403).json({ message: "user not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  },
);

// TODO: fix refresh token thing
// logout user route
router.post("/logout", authenticateJwt, async (req: Request, res: Response) => {
  const secret = process.env.SECRET;
  if (typeof secret === "undefined") {
    return res.status(500).json({ message: "internal error" });
  }
  const { userId } = req.headers;
  if (userId) {
    try {
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        const cookies = new Cookies(req, res);
        const token = cookies.get("user-token") as string;
        existingUser.loginSessions = await refreshLoginSession(
          token,
          secret,
          existingUser.loginSessions,
        );
        await existingUser.save();
        cookies.set("user-token", null);
        res.json({ message: "logged out" });
      } else {
        res.status(403).json({ message: "user dose not exists" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else {
    res.status(402).json({ message: "userId dose not exists" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const regex = req.query.regex;
  console.log("req.query", req.query);
  // get users with pattern
  if (typeof regex === "string" && regex.length !== 0) {
    console.log("regex", regex);
    try {
      const users = await User.find({ name: { $regex: regex, $options: "i" } });
      res.json({ users });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  } else {
    // get all users
    try {
      const users = await User.find({});
      return res.json({ users });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "internal error" });
    }
  }
});

// get one user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existingUser = await User.findOne({ _id: id });
    if (existingUser) {
      res.json({ user: existingUser });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal error" });
  }
});
