/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


export const UserRoutes = Router();

UserRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
UserRoutes.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);

UserRoutes.patch("/:id",checkAuth(...Object.values(Role)),UserController.updateUser)