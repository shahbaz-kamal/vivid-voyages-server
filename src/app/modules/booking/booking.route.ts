import { Role } from "./../user/user.interface";

import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { BookingController } from "./booking.controller";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

//*  create Booking ===>   "backened_URL/api/v1/booking"
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BookingController.createBooking
);
//*  get All Booking ===>   "backened_URL/api/v1/booking"
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  BookingController.getAllBooking
);
//*  get my Bookings ===>   "backened_URL/api/v1/booking/my-bookings"
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingController.myBookings
);
//*  get single Bookings ===>   "backened_URL/api/v1/booking/bookingId"
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getSingleBooking
);
//*  update  Booking status ===>   "backened_URL/api/v1/booking/bookingId/status"
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema),
  BookingController.updateBookingStatus
);
export const BookingRoutes = router;
