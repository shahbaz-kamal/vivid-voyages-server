/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/errors.types";

export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const message = `${error.message.match(/"([^"]*)"/)[1]} already exists`;
  return { statusCode: 400, message };
};
