import express from "express";
import {
  addWishlist,
  deleteWishlist,
  getWishlist,
  updateWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middlewares/protect.js";
import {
  addWishlistValidator,
  updateWishlistValidator,
} from "../validators/wishlist.validator.js";
import validateSchema from "../middlewares/validateSchema.js";
import checkDocIsExistById from "../middlewares/checkDocIsExistById.js";
import Product from "../models/Product.js";

const wishlistRouter = express.Router();

wishlistRouter
  .route("/")
  .get(protect, getWishlist)
  .post(
    validateSchema(addWishlistValidator),
    protect,
    checkDocIsExistById(Product),
    addWishlist
  )
  .put(
    validateSchema(updateWishlistValidator),
    protect,
    checkDocIsExistById(Product),
    updateWishlist
  )
  .delete(protect, deleteWishlist);

export default wishlistRouter;
