"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelpers_1 = __importDefault(require("../../../helpers/paginationHelpers"));
const order_model_1 = require("./order.model");
const order_constant_1 = require("./order.constant");
const user_model_1 = require("../user/user.model");
const cow_model_1 = require("../cow/cow.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createOrderToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: payload.buyer });
    const cow = yield cow_model_1.Cow.findOne({ _id: payload.cow });
    let result = null;
    if ((user === null || user === void 0 ? void 0 : user.budget) === undefined ||
        (cow === null || cow === void 0 ? void 0 : cow.price) === undefined ||
        (user === null || user === void 0 ? void 0 : user.budget) < (cow === null || cow === void 0 ? void 0 : cow.price)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create order");
    }
    if ((cow === null || cow === void 0 ? void 0 : cow.label) === "sold out") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The cow is sold out");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Update cow model
        yield cow_model_1.Cow.updateOne({ _id: payload.cow }, { $set: { label: "sold out" } });
        // Update user model for buyer
        yield user_model_1.User.updateOne({ _id: payload.buyer }, { $inc: { budget: -parseInt(`${cow.price}`) } });
        // Update user model for seller
        yield user_model_1.User.updateOne({ _id: cow.seller }, { $inc: { budget: parseInt(`${cow.price}`) } });
        result = (yield order_model_1.Order.create(payload)).populate("cow buyer");
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return result;
});
const getAllOrdersFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Searching & filtering
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.orderSearchFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Pagination & Sorting
    const { page, skip, limit, sortBy, sortOrder } = (0, paginationHelpers_1.default)(paginationOptions);
    const sortConditioins = {};
    if (sortBy && sortOrder) {
        sortConditioins[sortBy] = sortOrder;
    }
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield order_model_1.Order.find(whereCondition)
        .sort(sortConditioins)
        .skip(skip)
        .limit(limit);
    // const total = await AcademicSemester.countDocuments();
    const total = result.length;
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findOne({ _id: id });
    return result;
});
exports.OrderServices = {
    createOrderToDB,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
};
