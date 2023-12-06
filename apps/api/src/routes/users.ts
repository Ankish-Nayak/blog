import Cookies from "cookies";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "models";
import multer from "multer";
import path from "path";
import { loginTypes, signUpTypes, updateProfileTypes } from "types";
import { secret } from "..";
import { refreshLoginSession } from "../helpers/removeExpiryToken";
import { authenticateJwt } from "../middlewares/auth";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../data/"));
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage });
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
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedInput = loginTypes.parse(req.body);
      const { email, password } = parsedInput;
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
        res.status(401).json({
          error: "Invalid username or password",
        });
      }
    } catch (e) {
      next(e);
    }
  },
);

// sign up route for user
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedInput = signUpTypes.parse(req.body);
      const { name, email, password } = parsedInput;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          error: "Email address is already taken",
        });
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
      next(e);
    }
  },
);

router.post(
  "/uploadProfile",
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    if (req.file) {
      console.log("req.file", req.file);
      res.json({ message: "file uploaded" });
    } else {
      res.status(403).json({ message: "send file" });
    }
  },
);

// update profile
router.post(
  "/profile",
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.userId as string;
    try {
      const parsedInputs = updateProfileTypes.parse(req.body);
      const { name, email } = parsedInputs;
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
      next(e);
    }
  },
);

router.post(
  "/logout",
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers.userId as string;
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
      next(e);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const regex = req.query.regex;
  console.log("req.query", req.query);
  // get users with pattern
  if (typeof regex === "string" && regex.length !== 0) {
    console.log("regex", regex);
    try {
      const users = await User.find({ name: { $regex: regex, $options: "i" } });
      res.json({ users });
    } catch (e) {
      next(e);
    }
  } else {
    // get all users
    try {
      const users = await User.find({});
      return res.json({ users });
    } catch (e) {
      next(e);
    }
  }
});

// get one user
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const existingUser = await User.findOne({ _id: id });
    if (existingUser) {
      console.log(existingUser);
      res.json({ user: existingUser });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } catch (e) {
    next(e);
  }
});
