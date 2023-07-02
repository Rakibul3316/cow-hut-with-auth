import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserExistResponse, UserModel } from "./user.interface";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModel>(
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
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      selete: 0,
    },
    role: {
      type: String,
      require: true,
      enum: ["seller", "buyer"],
    },
    budget: {
      type: Number,
      require: true,
    },
    income: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// User exist static method
userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<IUserExistResponse | null> {
  return await User.findOne(
    { phoneNumber },
    { password: 1, role: 1, phoneNumber: 1 }
  );
};

// User password match
userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Hashing passwor
userSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>("user", userSchema, "user");
