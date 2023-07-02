import express from "express";
import { CowControllers } from "./cow.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.post("/create", auth(ENUM_USER_ROLE.SELLER), CowControllers.createCow);

router.patch("/:id", auth(ENUM_USER_ROLE.SELLER), CowControllers.updateCow);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowControllers.getSingleCow
);

router.delete("/:id", auth(ENUM_USER_ROLE.SELLER), CowControllers.deleteCow);

router.get(
  "/",
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowControllers.getAllCows
);

export const CowRoutes = router;
