import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/errors.types";

export const handleCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: mongoose.Error.CastError
): TGenericErrorResponse => {
  const message = "Invalid mongodb object id. please provide a valid id";
  return { statusCode: 400, message };
};
