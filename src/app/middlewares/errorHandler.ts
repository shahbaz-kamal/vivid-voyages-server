import { NextFunction, Request, Response } from "express";
// import { envVars } from "../config/env";
// import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";

// export const notFoundError = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let message = "Route Not Found";
//   let statusCode = 404;

//   if (err instanceof AppError) {
//     statusCode = err.statusCode;
//     message = err.message;
//   }

//   res.status(statusCode).json({
//     message,
//     success: false,
//     error: {
//       name: "NotFoundError",
//       details: `Cannot ${req.method} ${req.originalUrl}`,
//     },
//     stack: envVars.NODE_ENV === "development" ? err.stack : null,
//   });
//   next();
// };

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
    message,
    success: false,
    error: {
      name: error.name,
      details: error.details || null,
    },
  });
  // Generic fallback
  //   res.status(500).json({
  //     message: "Something went wrong",
  //     success: false,
  //     error,
  //   });
  return;
};
