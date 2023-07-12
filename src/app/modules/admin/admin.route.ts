import express from "express";
import { AdminControllers } from "./admin.controller";
const router = express.Router();

router.post("/create-admin", AdminControllers.createAdmin);

router.post("/login", AdminControllers.loginAdmin);

router.post("/refresh-token", AdminControllers.refreshToken);

export const AdminRoutes = router;
