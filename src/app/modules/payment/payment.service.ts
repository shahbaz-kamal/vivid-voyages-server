import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

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
const failPayment = async () => {
  //update booking status to Fail
  //update payment status to Fail
};
const cancelPayment = async () => {
  //update booking status to Cancel
  //update payment status to Cancel
};

export const PaymentService = { successPayment, failPayment, cancelPayment };
