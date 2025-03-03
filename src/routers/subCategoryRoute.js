import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObj,
} from "../controllers/sub.category.controller.js";
import protect from "../middlewares/protect.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { Roles_Enum } from "../constants/constants.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createSubCategorySchema } from "../validators/subCategory.validator.js";

const subCategoryRoute = express.Router({ mergeParams: true });

subCategoryRoute
  .route("/")
  .post(
    validateSchema(createSubCategorySchema),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);

subCategoryRoute
  .route("/:id")
  .get(getSubCategory)
  .put(
    validateSchema(createSubCategorySchema),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    updateSubCategory
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteSubCategory);

export default subCategoryRoute;
