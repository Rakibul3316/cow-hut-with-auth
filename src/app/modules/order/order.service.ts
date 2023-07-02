import mongoose, { SortOrder } from "mongoose";
import calculatePagination from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IOrder, IOrderFilters } from "./order.interface";
import { Order } from "./order.model";
import { orderSearchFields } from "./order.constant";
import { User } from "../user/user.model";
import { Cow } from "../cow/cow.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

type IPrice = number | undefined;

const createOrderToDB = async (payload: IOrder): Promise<IOrder | null> => {
  const user = await User.findOne({ _id: payload.buyer });
  const cow = await Cow.findOne({ _id: payload.cow });
  let result = null;

  if (
    user?.budget === undefined ||
    cow?.price === undefined ||
    user?.budget < cow?.price
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
  }

  if (cow?.label === "sold out") {
    throw new ApiError(httpStatus.BAD_REQUEST, "The cow is sold out");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update cow model
    await Cow.updateOne({ _id: payload.cow }, { $set: { label: "sold out" } });

    // Update user model for buyer
    await User.updateOne(
      { _id: payload.buyer },
      { $inc: { budget: -parseInt(`${cow.price}`) } }
    );

    // Update user model for seller
    await User.updateOne(
      { _id: cow.seller },
      { $inc: { budget: parseInt(`${cow.price}`) } }
    );
    result = (await Order.create(payload)).populate("cow buyer");

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return result;
};

const getAllOrdersFromDB = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  // Searching & filtering
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Pagination & Sorting
  const { page, skip, limit, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditioins: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditioins[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereCondition)
    .sort(sortConditioins)
    .skip(skip)
    .limit(limit);

  // const total = await AcademicSemester.countDocuments();
  const total = result.length;

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleOrderFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findOne({ _id: id });
  return result;
};

export const OrderServices = {
  createOrderToDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
};
