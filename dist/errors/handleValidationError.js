"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map((elem) => {
        return {
            path: elem === null || elem === void 0 ? void 0 : elem.path,
            message: elem === null || elem === void 0 ? void 0 : elem.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation error",
        errorMessages: errors,
    };
};
exports.default = handleValidationError;
