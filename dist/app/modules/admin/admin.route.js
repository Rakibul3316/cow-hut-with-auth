"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.post("/create", admin_controller_1.AdminControllers.createAdmin);
router.post("/login", admin_controller_1.AdminControllers.loginAdmin);
router.post("/refresh-token", admin_controller_1.AdminControllers.refreshToken);
exports.AdminRoutes = router;
