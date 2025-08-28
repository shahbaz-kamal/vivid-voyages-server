import { Router } from "express";
import { AuthControllers } from "./auth.controller";

export const AuthRoute = Router();

AuthRoute.post("/login", AuthControllers.credentialsLogin);
