import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/success", PaymentController.successPayment);
// router.post("/fail",)
// router.post("/cancel",)
export const PaymentRoutes = router;
