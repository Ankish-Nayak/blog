import { connect } from "mongoose";
import donenv, { config } from "dotenv";
export * from "./posts";
export * from "./users";

config();

export const run = async (): Promise<boolean> => {
  return new Promise(async (res, rej) => {
    try {
      const url = process.env.DATABASE_URL;
      if (typeof url === "undefined") {
        throw new Error("data base url not found");
      }
      await connect(url, {
        dbName: "blog",
      });
      res(true);
    } catch (e) {
      console.log(e);
      rej(false);
    }
  });
};
