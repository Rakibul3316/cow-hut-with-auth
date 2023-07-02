import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAdmin, ILoginAdminReponse } from "./admin.interface";
import { AdminServices } from "./admin.service";
import config from "../../../config";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminServices.createAdminToDB(adminData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    meta: null,
    message: "Admin created successfully!",
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminServices.loginAdminToSystem(loginData);
  const { refreshToken, ...otherData } = result;

  // Set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production" ? true : false,
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminReponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully",
    meta: null,
    data: otherData,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AdminServices.refreshToken(refreshToken);

  // Set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production" ? true : false,
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminReponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully",
    meta: null,
    data: result,
  });
});

export const AdminControllers = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
