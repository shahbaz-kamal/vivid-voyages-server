import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";

export const notFoundError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    message: "Route Not Found",
    success: false,
    error: {
      name: "NotFoundError",
      details: `Cannot ${req.method} ${req.originalUrl}`,
    },
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
  next();
};

export const globalErrorHandlers = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "validationError") {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Validation failed",
      success: false,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
  if (error.name === "ReferenceError") {
    res.status(400).json({
      message: error.message,
      success: false,
      error: {
        name: error.name,
        details: error.details || null,
      },
    });
    return;
  }
  // Generic fallback
  res.status(500).json({
    message: "Something went wrong",
    success: false,
    error,
  });
  return;
};
