import { SortOrder } from "mongoose";
import calculatePagination from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { userSearchFields } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import { Admin } from "../admin/admin.model";
import { IAdmin } from "../admin/admin.interface";

const createUserToDB = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  // Searching & filtering
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchFields.map((field) => ({
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

  const result = await User.find(whereCondition)
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

const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: id });
  return result;
};

const updateUserToDB = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

// const getProfileFromDB = async (id: string): Promise<IUser | null> => {
//   const result = await User.findOne({ _id: id });
//   return result;
// };

// const updateProfileToDB = async (
//   id: string,
//   payload: Partial<IAdmin>
// ): Promise<IAdmin | null> => {
//   const result = await Admin.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };

export const UserServices = {
  createUserToDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserToDB,
  deleteUserFromDB
};
