"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    cow: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "cow",
    },
    buyer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)("order", orderSchema, "order");
