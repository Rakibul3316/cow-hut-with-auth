import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin, AdminModel, IAdminExistResponse } from "./admin.interface";
import config from "../../../config";

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Admin exist static method
adminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<IAdminExistResponse | null> {
  return await Admin.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  );
};

// Admin password match
adminSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Hashing password
adminSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>("admin", adminSchema, "admin");
