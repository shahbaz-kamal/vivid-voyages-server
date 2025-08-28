import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token Recieved");
      }

      const verifiedToken = jwt.verify(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "you are not permitted to view this route");
      }
      req.user = verifiedToken;
      // console.log("from verified token", verifiedToken);
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
