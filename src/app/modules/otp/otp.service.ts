import { envVars } from "../../config/env";
import { redisClient } from "../../config/redis.config";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";

const sendOTP = async (email: string, name: string) => {
  const otp = generateOtp();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: Number(envVars.REDIS.OTP_EXPIRATION_TIME),
    },
  });
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name:name,
      otp:otp,
    },
  });
};
const verifyOTP = async () => {
  console.log("object");
};

export const OTPService = { sendOTP, verifyOTP };
