import { Model } from "mongoose";

export type IAdmin = {
  phoneNumber: string;
  role: "admin";
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminReponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IAdminFilters = {
  searchTerm?: string;
};

export type IAdminExistResponse = {
  _id: string;
  password: string;
  role: string;
  phoneNumber: string;
};

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
export type AdminModel = {
  isAdminExist(phoneNumber: string): Promise<IAdminExistResponse>;

  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;
