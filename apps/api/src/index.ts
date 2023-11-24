import express from "express";
import { router as userRouter } from "./routes/users";
import { router as postRouter } from "./routes/posts";
import { run as connectToDb } from "./models";
const app = express();

app.use("/users", userRouter);
app.use("/posts", postRouter);

connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(() => {
    console.log("failed");
  });
