import { SortOrder } from "mongoose";
import calculatePagination from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { cowSearchFields } from "./cow.constant";
import { ICow, ICowFilters } from "./cow.interface";
import { Cow } from "./cow.model";

const createCowToDB = async (payload: ICow): Promise<ICow> => {
  const result = (await Cow.create(payload)).populate("seller");
  return result;
};

const getAllCowsFromDB = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  // Searching & filtering
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchFields.map((field) => ({
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

  const result = await Cow.find(whereCondition)
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

const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOne({ _id: id });
  return result;
};

const updateCowToDB = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowServices = {
  createCowToDB,
  getAllCowsFromDB,
  getSingleCowFromDB,
  updateCowToDB,
  deleteCowFromDB,
};
