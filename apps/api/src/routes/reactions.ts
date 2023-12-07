import express from "express";
import * as reactionController from "../controllers/reactionController";

export const router = express.Router();

router.get("/", reactionController.getReactionsByLoggedInUserIdAndPostId);
