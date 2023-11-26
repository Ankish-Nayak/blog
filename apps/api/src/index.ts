import express from "express";
import { router as userRouter } from "./routes/users";
import { router as postRouter } from "./routes/posts";
import { run as connectToDb } from "./models";
import { config } from "dotenv";
config();
const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);

connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("live at ", `http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(() => {
    console.log("failed");
  });
