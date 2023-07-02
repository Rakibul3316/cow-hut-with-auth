import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { UserServices } from "./user.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { userFilterableFields } from "./user.constant";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import JwtPayload, { Secret } from "jsonwebtoken";
import { IAdmin } from "../admin/admin.interface";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserServices.createUserToDB(userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    meta: null,
    message: "User created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserServices.getAllUsersFromDB(
    filters,
    paginationOptions
  );

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived user data",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Find specific user",
    meta: null,
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await UserServices.updateUserToDB(id, updateData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    meta: null,
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserServices.deleteUserFromDB(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    meta: null,
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const result = await UserServices.getSingleUserFromDB(user._id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's information retrieved successfully",
      meta: null,
      data: result,
    });
  } else {
    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      meta: null,
      data: null,
    });
  }
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const updateData = req.body;

  if (user) {
    const result = await UserServices.updateUserToDB(user._id, updateData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      meta: null,
      data: result,
    });
  }
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
