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
  const session = await Booking.startSession();
  session.startTransaction();
  try {
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

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId,
          amount,
          status: PAYMENT_STATUS.UNPAID,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,

      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction();
    return updateBooking;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
