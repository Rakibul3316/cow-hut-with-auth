import { Model, Types } from "mongoose";

export type IOrder = {
  cow: Types.ObjectId;
  buyer?: Types.ObjectId;
  seller?: Types.ObjectId;
};

export type IOrderFilters = {
  searchTerm?: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
