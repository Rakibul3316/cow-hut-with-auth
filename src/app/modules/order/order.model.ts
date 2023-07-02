import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "cow",
    },
    buyer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder, OrderModel>("order", orderSchema, "order");
