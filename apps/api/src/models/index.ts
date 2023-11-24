import { connect } from "mongoose";

export * from "./posts";
export * from "./users";

export const run = async (): Promise<boolean> => {
  return new Promise(async (res, rej) => {
    try {
      const url = process.env.DATABASE_URL;
      if (typeof url === "undefined") {
        throw new Error("data base url not found");
      }
      await connect(url);
      res(true);
    } catch (e) {
      console.log(e);
      rej(false);
    }
  });
};
