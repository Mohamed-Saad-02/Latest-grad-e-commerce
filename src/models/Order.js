import mongoose, { Schema } from "mongoose";
import { OrderedStatus_Enum } from "../constants/constants.js";

const orderSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        qty: { type: Number, required: true },
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
    paidAt: {
      type: Date,
      select: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
    deliveredAt: {
      type: Date,
      select: false,
    },
    promoCode: {
      type: mongoose.Types.ObjectId,
      ref: "PromoCode",
      select: false,
    },
    isAdmin: Boolean,
    status: {
      type: String,
      enum: Object.values(OrderedStatus_Enum),
      default: OrderedStatus_Enum.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1 });

orderSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "name",
    },
    {
      path: "orderItems.product",
      select: "name price images",
    },
  ]);
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
