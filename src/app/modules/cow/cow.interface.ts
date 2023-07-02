import { Model, Types } from "mongoose";

export type ICow = {
  name: string;
  age: string;
  price: number;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymensingh";
  breed:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar"
    | "Kankrej";
  weight: number;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "Dual Purpose";
  seller: Types.ObjectId;
};

export type ICowFilters = {
  searchTerm?: string;
  location?: string;
  breed?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type CowModel = Model<ICow, Record<string, unknown>>;
