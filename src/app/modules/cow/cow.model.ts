import { Schema, model } from "mongoose";
import { CowModel, ICow } from "./cow.interface";

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
    location: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chattogram",
        "Barishal",
        "Rajshahi",
        "Sylhet",
        "Comilla",
        "Rangpur",
        "Mymensingh",
      ],
    },
    breed: {
      type: String,
      required: true,
      enum: [
        "Brahman",
        "Nellore",
        "Sahiwal",
        "Gir",
        "Indigenous",
        "Tharparkar",
        "Kankrej",
      ],
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
      enum: ["for sale", "sold out"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Dairy", "Beef", "Dual Purpose"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Cow = model<ICow, CowModel>("cow", cowSchema, "cow");
