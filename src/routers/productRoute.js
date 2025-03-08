import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getTopSale,
  getRelatedProducts,
  createFilterObj,
} from "../controllers/product.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import protect from "../middlewares/protect.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";
import { ImageExtinction, Roles_Enum } from "../constants/constants.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";
import addFieldMulterToBody from "../middlewares/addFieldMulterToBody.js";
import checkDocIsExistById from "../middlewares/checkDocIsExistById.js";
import Brand from "../models/Brand.js";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

const productRouter = express.Router();

productRouter.get("/top-sale", getTopSale);

productRouter
  .route("/")
  .get(createFilterObj, getProducts)
  .post(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("products", ImageExtinction).array("images", 4),
    addFieldMulterToBody("images"),
    validateSchema(createProductSchema),
    checkDocIsExistById(Brand),
    checkDocIsExistById(Category),
    checkDocIsExistById(SubCategory),
    createProduct
  );

productRouter.get("/:id/related", getRelatedProducts, getProducts);

productRouter
  .route("/:id")
  .get(getProduct)
  .put(
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    multerMiddleware("products", ImageExtinction).array("images", 4),
    addFieldMulterToBody("images"),
    validateSchema(updateProductSchema),
    checkDocIsExistById(Brand),
    checkDocIsExistById(Category),
    checkDocIsExistById(SubCategory),
    updateProduct
  )
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteProduct);

export default productRouter;
