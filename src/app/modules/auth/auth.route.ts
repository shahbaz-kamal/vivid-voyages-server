import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const AuthRoute = Router();

AuthRoute.post("/login", AuthControllers.credentialsLogin);
AuthRoute.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoute.post("/logout", AuthControllers.logout);
AuthRoute.post("/reset-password",checkAuth(...Object.values(Role)) ,AuthControllers.resetPassword);
