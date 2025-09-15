import { sendResponse } from "./../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = "";
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking created",
      data,
    });
  }
);

const getAllBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = "";
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Got Booking Data",
      data,
    });
  }
);
const myBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = "";
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Got Booking Data",
      data,
    });
  }
);
const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = "";
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Got Booking Data",
      data,
    });
  }
);
const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = "";
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Got Booking Data",
      data,
    });
  }
);

export const BookingController = { createBooking, getAllBooking,myBookings,getSingleBooking,updateBookingStatus };
