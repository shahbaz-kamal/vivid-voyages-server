import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import crypto from "crypto";
import { Tour } from "../tour/tour.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";

const generateTransactionId = () => {
  const timestamp = Date.now(); // milliseconds
  const random = crypto.randomBytes(6).toString("hex"); // 12-char random string
  return `trans_${timestamp}_${random}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = generateTransactionId();
  const user = await User.findById(userId);
  if (!user?.phone || !user?.address)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update your Phone number and address"
    );

  const tour = await Tour.findById(payload.tour).select("costFrom");
  if (!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
  }

  const amount = Number(tour.costFrom) * (payload.guestCount as number);

  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });

  const payment = await Payment.create({
    booking: booking._id,
    transactionId,
    amount,
    status: PAYMENT_STATUS.UNPAID,
  });

  const updateBooking = await Booking.findByIdAndUpdate(
    booking._id,
    {
      payment: payment._id,
    },
    { new: true, runValidators: true }
  )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment");
  return updateBooking;
};
const getAllBooking = async () => {
  return "hello";
};
const getUserBookings = async () => {
  return "hello";
};
const getSingleBooking = async () => {
  return "hello";
};
const updateBookingStatus = async (payload: Partial<IBooking>) => {
  return payload;
};

export const BookingService = {
  createBooking,
  getAllBooking,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
