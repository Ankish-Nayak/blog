import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import * as userController from "../controllers/userController";
import * as postController from "../controllers/postController";
import { authenticateJwt } from "../middlewares/auth";
import * as notificationController from "../controllers/notificationController";

config();
export const router = express.Router();

router.get("/me", authenticateJwt, userController.me);

router.post("/login", userController.login);

router.post("/signup", userController.signup);

router.post("/profile", authenticateJwt, userController.updateProfile);

router.post("/logout", authenticateJwt, userController.logout);

router.get(
  "/:userId/post-count",
  authenticateJwt,
  postController.getPostCountByUserId,
);

router.get(
  "/notifications",
  authenticateJwt,
  notificationController.getNotificationForLoggedInUser,
);

router.get(
  "/notifications/notification-count",
  authenticateJwt,
  notificationController.getNotificationCount,
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const regex = req.query.regex;
  const postCount = req.query.postCount;
  console.log("req.query", req.query);
  // get users with pattern
  if (typeof regex === "string" && regex.length !== 0 && postCount) {
    console.log("hit");
    return userController.getUserNameAndPostCount(regex, req, res, next);
  }
  if (typeof regex === "string" && regex.length !== 0) {
    return userController.getUsersByRegex(regex, req, res, next);
  } else {
    // get all users
    return userController.getAllUsers(req, res, next);
  }
});

router.get("/:id", authenticateJwt, userController.getUserById);
