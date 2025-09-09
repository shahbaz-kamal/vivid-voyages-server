/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/errors.types";

export const handleZodError = (error: any): TGenericErrorResponse => {
  const message = "Zod Error";
  const errorSources: TErrorSources[] = [];
  error.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return { statusCode: 400, message, errorSources };
};
