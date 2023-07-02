import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ICow } from "./cow.interface";
import { CowServices } from "./cow.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { cowFilterableFields } from "./cow.constant";

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  const result = await CowServices.createCowToDB(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    meta: null,
    message: "Cow created successfully!",
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowServices.getAllCowsFromDB(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived cow data",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowServices.getSingleCowFromDB(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Find specific cow",
    meta: null,
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const { ...updateData } = req.body;

  const result = await CowServices.updateCowToDB(id, updateData);

  if (user?._id === result?.seller.toString()) {
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow updated successfully",
      meta: null,
      data: result,
    });
  } else {
    sendResponse<ICow>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: true,
      message: "You are requesting for wrong cow",
      meta: null,
      data: result,
    });
  }
});

const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const result = await CowServices.deleteCowFromDB(id);

  if (user?._id === result?.seller.toString()) {
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow deleted successfully",
      meta: null,
      data: result,
    });
  } else {
    sendResponse<ICow>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: true,
      message: "You are requesting for wrong cow",
      meta: null,
      data: result,
    });
  }
});

export const CowControllers = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
