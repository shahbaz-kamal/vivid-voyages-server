import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";
import { required } from "zod/v4/core/util.cjs";

const paymentSchema = new Schema<IPayment>({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true,
  },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  paymentGatewayData: { type: Schema.Types.Mixed },
  invoiceUrl: { type: String },
  status: { type: String, enum: Object.values(PAYMENT_STATUS) },
});

export const Payment = model<IPayment>("Payment", paymentSchema);
