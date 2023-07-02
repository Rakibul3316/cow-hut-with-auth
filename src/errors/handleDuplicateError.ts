import { MongoError } from "mongodb";
import { IGenericErrorMessage } from "../interfaces/error";
import { IGenericErrorResponse } from "../interfaces/common";
import { MongooseError } from "mongoose";

const handleDuplicateError = (error: MongoError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: "",
      message: error.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate error",
    errorMessages: errors,
  };
};

export default handleDuplicateError;
