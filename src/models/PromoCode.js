import mongoose from "mongoose";
import {
  DiscountType_Enum,
  PromoCodeStatus_Enum,
} from "../constants/constants.js";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Promo Code is required"],
      unique: true,
      trim: true,
    },
    maxUsage: Number,
    discount: {
      discountType: {
        type: String,
        enum: Object.values(DiscountType_Enum),
        default: DiscountType_Enum.PERCENTAGE,
      },
      value: {
        type: Number,
        required: [true, "Discount value is required"],
      },
    },
    expiredAt: {
      type: Date,
      default: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    status: {
      type: String,
      enum: Object.values(PromoCodeStatus_Enum),
      default: PromoCodeStatus_Enum.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PromoCode ||
  mongoose.model("PromoCode", promoCodeSchema);
