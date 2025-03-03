import express from "express";
import {
  getCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import subCategoryRoute from "./subCategoryRoute.js";
import protect from "../middlewares/protect.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { ImageExtinction, Roles_Enum } from "../constants/constants.js";
import addFieldMulterToBody from "../middlewares/addFieldMulterToBody.js";
import validateSchema from "../middlewares/validateSchema.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRoute);

categoryRouter
  .route("/")
  .get(getCategories)
  .post(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("categories", ImageExtinction).single("image"),
    validateSchema(createCategorySchema),
    addFieldMulterToBody("image"),
    createCategory
  );

categoryRouter
  .route("/:id")
  .get(getCategoryByID)
  .put(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("categories", ImageExtinction).single("image"),
    validateSchema(updateCategorySchema),
    addFieldMulterToBody("image"),
    updateCategory
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteCategory);

export default categoryRouter;
