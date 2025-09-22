/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";

import { User } from "../user/user.model";

import httpStatus from "http-status-codes";

import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";

export const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return { accessToken: newAccessToken };
};
export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Dosent match");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "User does not exist");

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set password. Now you can change password from your profile"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};
const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");
  }
  if (isUserExist.isActive === IsActive.BLOCKED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVars.FRONTEND_URl}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
  sendEmail({
    to: isUserExist.email,
    subject: "Password reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};
export const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You can not reset your password"
    );
  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashedPassword;
  await isUserExist.save();
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
};
