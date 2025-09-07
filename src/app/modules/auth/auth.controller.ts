/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(error);
      }
      if (!user) return next(error);

      const tokenInfo = createUserToken(user);
      delete user.toObject().password;

      setAuthCookie(res, tokenInfo);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user loged in successfully",
        data: {
          accessToken: tokenInfo.accessToken,
          refreshToken: tokenInfo.refreshToken,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies"
      );
    }
    //   const user = await UserServices.createUser(req.body);
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    setAuthCookie(res, tokenInfo);
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "new access Token retrieved successfully",
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "logged out",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Password changed successfully ",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = (req.query.state ? req.query.state : "") as string;
    if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);
    const user = req.user;
    console.log("user===>", user);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "Password changed successfully ",
    //   data: null,
    // });
    res.redirect(`${envVars.FRONTEND_URl}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
