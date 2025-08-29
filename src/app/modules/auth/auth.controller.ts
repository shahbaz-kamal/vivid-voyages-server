import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    //   const user = await UserServices.createUser(req.body);
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user loged in successfully",
      data: loginInfo,
    });
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
export const AuthControllers = { credentialsLogin, getNewAccessToken, logout };
