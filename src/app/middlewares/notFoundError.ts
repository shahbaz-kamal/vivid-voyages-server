import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

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
