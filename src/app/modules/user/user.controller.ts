import { NextFunction } from "express";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user created successfully",
      data: user,
    });
  }
);
const updateUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token=req.headers.authorization
    // const verifiedToken=verifyToken(token as string,envVars.JWT_SECRET ) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Updated successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    console.log(userId);
    const result = await UserServices.getSingleUser(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: " User Data Retrieved Successfully",
      data: result.data,
    });
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: " your profile retrieved successfully",
      data: result.data,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
};
