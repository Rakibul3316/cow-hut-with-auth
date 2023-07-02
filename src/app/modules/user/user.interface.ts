import { Model } from "mongoose";

export type IUser = {
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type IUserFilters = {
  searchTerm?: string;
};

export type ILoginUserReponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IUserExistResponse = {
  _id: string;
  password: string;
  role: string;
  phoneNumber: string;
};

export type UserModel = {
  isUserExist(phoneNumber: string): Promise<IUserExistResponse>;

  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
