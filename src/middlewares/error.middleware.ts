import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  return res
    .status(err.statusCode)
    .json(new ApiError(err.statusCode, err.message));
};
