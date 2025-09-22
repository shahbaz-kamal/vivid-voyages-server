/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerze } from "../sslCommerze/sslCommerze.interface";
import { SSLService } from "../sslCommerze/sslCommerze.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";
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
    const updatedBooking = await Booking.findByIdAndUpdate(
      { _id: updatedPayment?.booking },
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, new: true, session }
    )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updatedBooking) throw new AppError(401, "Booking Not Found");
    if (!updatedPayment) throw new AppError(401, "Payment Not Found");
    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking?.createdAt as Date,
      guestCount: updatedBooking?.guestCount,
      totalAmount: updatedPayment?.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      transactionId: (updatedPayment as unknown as IPayment).transactionId,
      userName: (updatedBooking.user as unknown as IUser).name,
    };
    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult: any = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );
    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      {
        invoiceUrl: cloudinaryResult.secure_url,
      },
      { runValidators: true, session }
    );
    console.log("CCCCL==>", cloudinaryResult);
    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          fileName: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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

const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");
  if (!payment) throw new AppError(401, "Payment not found");

  if (!payment.invoiceUrl) throw new AppError(401, "Invoice Not available yet");

  return payment.invoiceUrl;
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
};
