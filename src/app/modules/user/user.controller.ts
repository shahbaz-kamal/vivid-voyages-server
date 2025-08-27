import { NextFunction } from 'express';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User Created Successfully",
      userData: user,
    });
  } catch (error: any) {
    next(error)
  }
};

export const UserController = { createUser };
