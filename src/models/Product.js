import mongoose from "mongoose";
import { ProductStatus_Enum } from "../constants/constants.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name required"],
      trim: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
      // select: false,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    images: {
      type: [String],
      required: [true, "Product images required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Product images must have at least one",
      },
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    subCategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    status: {
      type: String,
      required: [true, "Product Status Is Required"],
      enum: {
        values: Object.values(ProductStatus_Enum),
        message: "Products Status Must Between Tow Value [inStock Or outStock]",
      },
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id",
  })
    .populate({
      path: "brand",
      select: "name _id",
    })
    .populate({
      path: "subCategory",
      select: "name _id",
    });
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
