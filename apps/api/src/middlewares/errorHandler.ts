import { CustomError } from "./CustomError";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

const errorHandler = (
  error: Error | CustomError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log the error
  console.error(error);

  // Default status code for unhandled errors
  let statusCode = 500;

  // If it's a custom error, use its status code
  if (error instanceof CustomError) {
    statusCode = error.status;
  }
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: error.errors });
  }

  // Send a JSON response with the error message
  res.status(statusCode).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
};

export default errorHandler;
