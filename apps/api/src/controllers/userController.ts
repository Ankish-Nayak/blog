import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "models";
import { loginTypes, signUpTypes, updateProfileTypes } from "types";
import { secret } from "..";
import { refreshLoginSession } from "../helpers/removeExpiryToken";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});
    return res.json({ users });
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};

export const getUsersByRegex = async (
  regex: string,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({ name: { $regex: regex, $options: "i" } });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};

export const getUserNameAndPostCount = async (
  regex: string,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.aggregate([
      { $match: { name: { $regex: regex, $options: "i" } } },
      {
        $project: {
          userId: "$_id",
          name: 1,
          postCount: {
            $size: "$posts",
          },
        },
      },
    ]);
    return res.json({ users });
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
  // console.log("hit");
  // const userId = req.headers.userId as string;
  // try {
  //   const existingUser = await User.findOne({ _id: userId });
  //   if (existingUser) {
  //     const cookies = new Cookies(req, res);
  //     const token = cookies.get("user-token") as string;
  //     existingUser.loginSessions = await refreshLoginSession(
  //       token,
  //       secret,
  //       existingUser.loginSessions,
  //     );
  //     await existingUser.save();
  //     cookies.set("user-token", null);
  //     res.json({ message: "logged out" });
  //   } else {
  //     res.status(403).json({ message: "user dose not exists" });
  //   }
  // } catch (e) {
  //   next(e);
  // }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId: string = req.headers.userId as string;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({
        error: "User not found",
        message: "The requested user could not be found on the server.",
      });
    }
  } catch (e) {
    next(e);
  }
};

export const me = async (req: Request, res: Response, _next: NextFunction) => {
  const name = req.headers.name;
  if (typeof name === "undefined") {
    res.status(403).json({ message: "user not logged in" });
  } else {
    res.json({ id: req.headers["userId"], name, message: "found" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};
// module.exports = {
//   getAllUsers,
//   getUserById,
//   login,
//   signup,
//   logout,
//   me,
//   getProfile,
//   updateProfile,
//   getUsersByRegex,
// };
