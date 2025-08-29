import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
 async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token Recieved");
      }

      const verifiedToken = jwt.verify(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload;
      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      })
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");
      }
      if (isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }
    
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
