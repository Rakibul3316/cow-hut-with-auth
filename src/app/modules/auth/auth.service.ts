import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ILoginUserReponse } from "../user/user.interface";
import { User } from "../user/user.model";
import { IAuthUser, IRefershTokenResponse } from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUserToSystem = async (
  payload: IAuthUser
): Promise<ILoginUserReponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credential does not match");
  }

  const isPasswordMatch = await User.isPasswordMatch(
    password,
    isUserExist?.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Credential does not match");
  }

  // Create access token & refresh token
  const { _id, role, phoneNumber: number } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { _id, role, number },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role, number },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  token: string
): Promise<IRefershTokenResponse | null> => {
  // verify token
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  // Check user existance.
  const { number } = verifiedToken;
  const isUserExist = await User.isUserExist(number);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not found!");
  }

  // Generate access token
  const newAccessToken = jwtHelpers.createToken(
    { _id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  loginUserToSystem,
  refreshToken,
};
