import { sendResponse } from "./../../utils/sendResponse";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const booking = await BookingService.createBooking(
    req.body,
    decodedToken.userId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const bookings = await BookingService.getAllBooking();
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Got All Booking Data",
    data: bookings,
  });
});
const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await BookingService.getUserBookings();
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Got Booking Data",
    data: bookings,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getSingleBooking();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking Retrivied Successfully",
    data: booking,
  });
});
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const updated = await BookingService.updateBookingStatus(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking status Updated Successfully",
    data: updated,
  });
});

export const BookingController = {
  createBooking,
  getAllBooking,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
