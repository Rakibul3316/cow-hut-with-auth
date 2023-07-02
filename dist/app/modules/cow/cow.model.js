"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cow = void 0;
const mongoose_1 = require("mongoose");
const cowSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
}, {
    timestamps: true,
});
exports.Cow = (0, mongoose_1.model)("cow", cowSchema, "cow");
