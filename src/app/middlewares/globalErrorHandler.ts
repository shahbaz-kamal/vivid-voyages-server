import { NextFunction, Request, Response } from "express";

import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { TErrorSources } from "../interfaces/errors.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorSources: TErrorSources[] = [];
  // eslint-disable-next-line no-console
  if (envVars.NODE_ENV === "development") console.log(error);
  // duplicate error
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
  }
  //cast error
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
  }
  //zod error
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  //ValidationError from mongoose
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });

  return;
};
