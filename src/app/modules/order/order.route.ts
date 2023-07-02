import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.BUYER),
  OrderControllers.createOrder
);

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.ADMIN
  ),
  OrderControllers.getSingleOrder
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.ADMIN
  ),
  OrderControllers.getAllOrders
);

export const OrderRoutes = router;
