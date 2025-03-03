import express from "express";
import {
  getBrands,
  createBrand,
  getBrandByID,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import addFieldMulterToBody from "../middlewares/addFieldMulterToBody.js";
import protect from "../middlewares/protect.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createBrandSchema } from "../validators/brand.validator.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";
import { ImageExtinction, Roles_Enum } from "../constants/constants.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const brandRouter = express.Router();

brandRouter
  .route("/")
  .get(getBrands)
  .post(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("brands", ImageExtinction).single("image"),
    validateSchema(createBrandSchema),
    addFieldMulterToBody("image"),
    createBrand
  );

brandRouter
  .route("/:id")
  .get(getBrandByID)
  .put(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("brands", ImageExtinction).single("image"),
    validateSchema(createBrandSchema),
    addFieldMulterToBody("image"),
    updateBrand
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteBrand);

export default brandRouter;
