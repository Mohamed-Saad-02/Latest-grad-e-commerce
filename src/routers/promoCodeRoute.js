import { Router } from "express";
import {
  addPromoCode,
  deletePromoCode,
  getAllPromoCodes,
  getPromoCode,
  updatePromoCode,
} from "../controllers/promoCode.controller.js";
import protect from "../middlewares/protect.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { Roles_Enum } from "../constants/constants.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  addPromoCodeValidator,
  updatePromoCodeValidator,
} from "../validators/promoCode.validator.js";

const promoCodeRouter = Router();

promoCodeRouter
  .route("/")
  .get(protect, authorizeRole(Roles_Enum.ADMIN), getAllPromoCodes)
  .post(
    validateSchema(addPromoCodeValidator),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    addPromoCode
  );

promoCodeRouter
  .route("/:id")
  .put(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    validateSchema(updatePromoCodeValidator),
    updatePromoCode
  )
  .get(protect, authorizeRole(Roles_Enum.ADMIN), getPromoCode)
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deletePromoCode);

export default promoCodeRouter;
