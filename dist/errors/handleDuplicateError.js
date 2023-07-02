"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const errors = [
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
exports.default = handleDuplicateError;
