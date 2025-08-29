import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

import httpStatus from "http-status-codes";

import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dosent exist");
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  const userTokens = createUserToken(isUserExist);
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    user: rest,
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  };
};

export const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return { accessToken: newAccessToken };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
