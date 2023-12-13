import { config } from "dotenv";
import { connect } from "mongoose";
export * from "./posts";
export * from "./profilePictures";
export * from "./reactions";
export * from "./users";
export * from "./notifications";
export * from "./savedPosts";

config();

export const run = async (): Promise<boolean> => {
  return new Promise(async (res, rej) => {
    try {
      const url = process.env.DATABASE_URL;
      const dbName = process.env.DATABASE_NAME;
      if (typeof url === "undefined") {
        throw new Error("data base url not found");
      }
      if (typeof dbName === "undefined") {
        throw new Error("database name not found");
      }
      console.log(url);
      await connect(url, {
        dbName: dbName,
      });
      res(true);
    } catch (e) {
      console.log(e);
      rej(false);
    }
  });
};
