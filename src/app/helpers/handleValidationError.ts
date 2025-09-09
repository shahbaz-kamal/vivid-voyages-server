import mongoose from "mongoose";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/errors.types";

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const message = error.message;
  const errors = Object.values(error.errors);
  const errorSources: TErrorSources[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: "Validation Error",
    })
  );
  return { statusCode: 400, message, errorSources };
};
