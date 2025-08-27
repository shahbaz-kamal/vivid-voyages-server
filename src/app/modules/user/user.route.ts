import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoutes = Router();

userRoutes.post("/register", UserController.createUser);
