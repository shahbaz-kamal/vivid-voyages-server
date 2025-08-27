/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

export const logger = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(
    `🔥Request sent from ${req.hostname} || ${req.method} -${
      req.url
    } -${new Date().toLocaleTimeString()}`
  );
  next();
};
