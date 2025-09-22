import express from "express";
import { StatsController } from "./stat.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
  );


router.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getBookingStats
);

router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getPaymentStats
);


router.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getTourStats
);

export const StatsRoute = router;
