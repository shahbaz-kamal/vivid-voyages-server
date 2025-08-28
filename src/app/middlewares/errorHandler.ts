import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = "Route Not Found";
  const statusCode = httpStatus.NOT_FOUND;
  res.status(statusCode).json({
    message,
    success: false,
    details: `Cannot ${req.method} ${req.originalUrl}`,
  });
  next();
};

export const globalErrorHandlers = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let message = "Something went Wrong";
  let statusCode = 500;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
  // Generic fallback
  //   res.status(500).json({
  //     message: "Something went wrong",
  //     success: false,
  //     error,
  //   });
  return;
};
