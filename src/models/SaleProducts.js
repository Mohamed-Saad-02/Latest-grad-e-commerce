import mongoose from "mongoose";
import { DiscountType_Enum } from "../constants/constants.js";

const SaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    unique: true,
  },
  discount: {
    discountType: {
      type: String,
      enum: Object.values(DiscountType_Enum),
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
  },
  startDate: Date,
  endDate: Date,
});

SaleSchema.pre(/^find/, function (next) {
  this.populate("productId");

  next();
});

const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;
