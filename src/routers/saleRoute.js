import { Router } from "express";
import {
  activeSales,
  checkIfProductValidAndOnSale,
  createOne,
  deleteAllSale,
  deleteSale,
  getAll,
  getSale,
  updateSale,
} from "../controllers/sale.controller.js";
import protect from "../middlewares/protect.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { Roles_Enum } from "../constants/constants.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  saleValidationSchema,
  updateSaleValidationSchema,
} from "../validators/sale.validator.js";

const saleRouter = Router();

saleRouter
  .route("/")
  .get(getAll)
  .post(
    validateSchema(saleValidationSchema),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    checkIfProductValidAndOnSale,
    createOne
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteAllSale);

saleRouter.get("/active", activeSales, getAll);

saleRouter
  .route("/:id")
  .get(getSale)
  .put(
    validateSchema(updateSaleValidationSchema),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    updateSale
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteSale);

export default saleRouter;
