import { Role } from "./user.interface";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

export const UserRoutes = Router();

UserRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
UserRoutes.get(
  "/all-users",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token Recieved");
      }

      const verifiedToken = jwt.verify(accessToken, "secret");

      // if (!verifiedToken) {
      //   throw new AppError(403, `you are not authorized, ${verifiedToken}`);
      // }

      if (
        (verifiedToken as JwtPayload).role !== Role.ADMIN ||
        Role.SUPER_ADMIN
      ) {
        throw new AppError(403, "you are not permitted to view this route");
      }

      console.log("from verified token", verifiedToken);
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  },

  UserController.getAllUsers
);
