import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = process.env.SECRET;
  if (typeof secret === "undefined") {
    console.log("secret dose not exists");
    return res.status(500).json({ message: "internal error" });
  }
  const cookies = new Cookies(req, res);
  const token = cookies.get("user-token");
  if (typeof token === "string") {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "jwt error" });
      }
      if (!payload || typeof payload === "string") {
        return res.status(403).json({ message: "type error" });
      }
      req.headers["name"] = payload.name;
      req.headers["userId"] = payload.userId;
      next();
    });
  } else {
    res.status(401).json({ message: "invalid token" });
  }
};
