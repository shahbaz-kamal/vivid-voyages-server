/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerze } from "../sslCommerze/sslCommerze.interface";
import { SSLService } from "../sslCommerze/sslCommerze.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const successPayment = async (query: Record<string, string>) => {
  //update booking status to confirm
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, new: true, session }
    );
    await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment completed Successfully" };
  } catch (error) {
    console.log(error);
  }
  //update payment status to paid
};
const failPayment = async (query: Record<string, string>) => {
  //update booking status to Fail
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, new: true, session }
    );
    await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    console.log(error);
  }
  //update payment status to Fail
};
const cancelPayment = async (query: Record<string, string>) => {
  //update booking status to Cancel
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment cancelled" };
  } catch (error) {
    console.log(error);
  }
  //update payment status to Cancel
};
const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You Have not booked this tour"
    );
  const booking = await Booking.findById(payment?.booking);
  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerze = {
    name: userName,
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhone,
    amount: payment?.amount,
    transactionId: payment?.transactionId,
  };
  const sslPayment = await SSLService.sslPaymentInit(sslPayload);
  return { paymentURL: sslPayment.GatewayPageURL };
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
