import z from "zod";
import { BOOKING_STATUS } from "./booking.interface";

export const createBookingZodSchema = z.object({
  user: z.string("userId must be string").optional(),
  tour: z.string(),
  payment: z.string().optional(),
  guestCount: z.number(),
});
export const updateBookingZodSchema = z.object({
  status: z.enum(Object.values(BOOKING_STATUS) as [string]),
});
