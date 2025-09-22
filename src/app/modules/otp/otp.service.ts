import { envVars } from "../../config/env";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(401, "User does not exist");
  if (user.isVerified) throw new AppError(401, "User is already verified");
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
      name: name,
      otp: otp,
    },
  });
};
const verifyOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email });

    if (!user) throw new AppError(401, "User does not exist");
    if (user.isVerified) throw new AppError(401, "User is already verified");
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) throw new AppError(401, "Invalid OTP");

  if (savedOtp !== otp) throw new AppError(401, "Invalid OTP");

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey),
  ]);
};

export const OTPService = { sendOTP, verifyOTP };
