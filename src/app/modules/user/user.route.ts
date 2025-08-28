/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

export const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
userRoutes.get("/all-users", UserController.getAllUsers);
