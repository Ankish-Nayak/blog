import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { run as connectToDb } from "models";
import errorHandler from "./middlewares/errorHandler";
import { router as postRouter } from "./routes/posts";
import { router as profilePictureRouter } from "./routes/profilePictures";
import { router as reactionRouter } from "./routes/reactions";
import { router as userRouter } from "./routes/users";
import { router as notificationRouter } from "./routes/notifications";
import removeNotificationWithoutReaction from "./setup/removeNotificationWithoutReactions";
import removeNotificationsWithoutReaction from "./setup/removeNotificationWithoutReactions";
import updateIsReadToFalse from "./setup/updateIsReadToFalse";

if (!process.env.SECRET) {
  console.log("Secret key is not defined in the environment variables.");
  process.exit(1);
}

export const secret: string = process.env.SECRET;

config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.urlencoded());
app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/reactions", reactionRouter);
app.use("/profilePictures", profilePictureRouter);
app.use("/notifications", notificationRouter);
app.use(errorHandler);
connectToDb()
  .then(() => {
    // updateIsReadToFalse();
    app.listen(process.env.PORT || 3000, () => {
      console.log("live at ", `http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(() => {
    console.log("failed");
  });
