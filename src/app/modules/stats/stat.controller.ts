import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getBookingStats();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users Data Retrieved Successfully",
    data: result,
  });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getTourStats();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour Data Received Successfully",
    data: result,
  });
});
const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getPaymentStats();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Invoice Download URL retrived",
    data: result,
  });
});
const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getUserStats();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users Data Retrieved Successfully",
    data: result,
  });
});

export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
