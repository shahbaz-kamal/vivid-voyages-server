import { Router } from "express";
import { AuthControllers } from "./auth.controller";

export const AuthRoute = Router();

AuthRoute.post("/login", AuthControllers.credentialsLogin);
AuthRoute.post("/refresh-token", AuthControllers.getNewAccessToken);
