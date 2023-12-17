import express, { NextFunction, Request, Response } from "express";
import { IncomingHttpHeaders } from "http2";
import * as postController from "../controllers/postController";
import { authenticateJwt } from "../middlewares/auth";

interface MRequest extends Request {
  headers: IncomingHttpHeaders | { userId: string; name: string };
}
export const router = express.Router();

router.get(
  "/",
  authenticateJwt,
  async (req: MRequest, res: Response, next: NextFunction) => {
    if (typeof req.query.userId === "string") {
      return postController.getPostsByAuthorId(
        req.query.userId,
        req,
        res,
        next,
      );
    } else if (typeof req.query.name === "string") {
      return postController.getPostsByAuthorName(
        req.query.name,
        req,
        res,
        next,
      );
    } else if (typeof req.query.title === "string") {
      return postController.getPostsByTitle(req.query.title, req, res, next);
    } else {
      return postController.getAllPosts(req, res, next);
    }
  },
);

router.get("/savedPosts", authenticateJwt, postController.getSavedPosts);
router.get("/title/", authenticateJwt, postController.getPostTitles);

router.post("/", authenticateJwt, postController.createPost);

router.put("/:id", authenticateJwt, postController.updatePost);

router.get("/:id", authenticateJwt, postController.getPostById);

router.delete("/:id", authenticateJwt, postController.deletePost);

// add reactions to post
router.patch("/:id", authenticateJwt, postController.addReactionToPost);

router.get("/:userId", authenticateJwt, postController.getPostById);

router.get(
  "/savedPosts/:postId/status",
  authenticateJwt,
  postController.getSavedPostStatus,
);
router.post(
  "/savedPosts/:postId",
  authenticateJwt,
  postController.addSavedPost,
);

router.delete(
  "/savedPosts/:postId/status",
  authenticateJwt,
  postController.deletePost,
);
