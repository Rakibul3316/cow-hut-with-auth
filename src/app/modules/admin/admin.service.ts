import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin, ILoginAdmin, ILoginAdminReponse } from "./admin.interface";
import { Admin } from "./admin.model";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

const createAdminToDB = async (payload: IAdmin): Promise<IAdmin> => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdminToSystem = async (
  payload: ILoginAdmin
): Promise<ILoginAdminReponse> => {
  const { phoneNumber, password } = payload;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credential does not match");
  }

  const isPasswordMatch = await Admin.isPasswordMatch(
    password,
    isAdminExist?.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Credential does not match");
  }

  // Create access token & refresh token
  const { _id, role, phoneNumber: number } = isAdminExist;

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
): Promise<ILoginAdminReponse | null> => {
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
  const isAdminExist = await Admin.isAdminExist(number);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not found!");
  }

  // Generate access token
  const newAccessToken = jwtHelpers.createToken(
    { _id: isAdminExist._id, role: isAdminExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminServices = {
  createAdminToDB,
  loginAdminToSystem,
  refreshToken,
};
