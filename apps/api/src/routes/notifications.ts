import express from "express";
import * as notificationControler from "../controllers/notificationController";
import { authenticateJwt } from "../middlewares/auth";
export const router = express.Router();

router.put(
  "/:reactionId/mark-as-read",
  authenticateJwt,
  notificationControler.markNotificationAsRead,
);

router.get("/", authenticateJwt, notificationControler.getNotifications);
