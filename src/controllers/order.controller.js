import catchAsync from "../utils/catchAsync.js";
import Order from "../models/Order.js";
import PromoCode from "../models/PromoCode.js";
import {
  DiscountType_Enum,
  OrderedStatus_Enum,
  PromoCodeStatus_Enum,
} from "../constants/constants.js";
import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import * as factory from "./handlerFactory.js";

// ------- User --------

// @desc    Get list of orders by user
// @route   GET /api/v1/orders/me
// @access  Private
export const getOrdersUsers = catchAsync(async (req, res, next) => {
  const { user } = req;
  const orders = await Order.find({
    user: user._id,
    status: { $ne: OrderedStatus_Enum.CANCELLED },
  });
  res.status(200).json({
    status: "success",
    orders,
  });
});

// @desc    Add order by user
// @route   POST /api/v1/orders/me
// @access  Private
export const addOrder = catchAsync(async (req, res, next) => {
  const { user, body } = req;
  const { orderItems, promoCode } = body;

  // Check if orderItems valid and in stock
  const products = await Promise.all(
    orderItems.map((item) =>
      Product.findOne({
        _id: item.product,
        quantity: { $gte: item.qty },
      })
        .select("quantity price")
        .lean()
    )
  );

  // Check if products and orderItems have the same length
  const isEqual = products.filter(Boolean).length === orderItems.length;
  if (!isEqual)
    return next(new AppError("Some products are out of stock", 404));

  // Calculate total price
  req.body.totalPrice = products.reduce(
    (total, product) =>
      (total + product.price) *
      orderItems.find((item) => item.product === product._id.toString()).qty,
    0
  );

  // Check if promoCode valid
  if (promoCode) {
    const promo = await PromoCode.findOne({
      code: promoCode,
      status: PromoCodeStatus_Enum.ACTIVE,
      maxUsage: { $gt: 0 },
      expiredAt: { $gt: Date.now() },
    });
    if (!promo)
      return next(new AppError("Promo Code not found or not valid", 404));

    req.body.promoCode = promo._id;

    req.body.discount =
      promo.discount.discountType === DiscountType_Enum.PERCENTAGE
        ? (promo.discount.value / 100) * req.body.totalPrice
        : promo.discount.value;
    req.body.totalPrice -= req.body.discount;
  }

  // Create Order
  const order = await Order.create({
    user: user._id,
    ...req.body,
    status: OrderedStatus_Enum.PENDING,
  });

  // Handle Operation Used
  handleOperationAddOrder(order);

  res.status(201).json({
    status: "success",
    order,
  });
});

const handleOperationAddOrder = async (order) => {
  const { orderItems, promoCode } = order;

  // Handle Promo Code
  if (promoCode) {
    const promo = await PromoCode.findById(promoCode);
    promo.maxUsage -= 1;
    if (promo.status === PromoCodeStatus_Enum.ACTIVE) {
      if (promo.maxUsage === 0) promo.status = PromoCodeStatus_Enum.INACTIVE;
    }
    await promo.save();
  }

  // Handle Order Items
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.qty, sold: item.qty },
      })
    )
  );
};

// @desc    Delete order by user
// @route   DELETE /api/v1/orders/me/:id
// @access  Private
export const deleteOrder = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, {
    status: OrderedStatus_Enum.CANCELLED,
    user: userId,
  });
  if (!order) return next(new AppError("Order not found", 404));

  handleOperationDeleteOrder(order);

  res.status(204).json({
    status: "success",
  });
});

const handleOperationDeleteOrder = async (order) => {
  const { orderItems, promoCode } = order;

  // Handle Promo Code
  if (promoCode) {
    const promo = await PromoCode.findById(promoCode);
    promo.maxUsage += 1;
    if (promo.status === PromoCodeStatus_Enum.INACTIVE)
      promo.status = PromoCodeStatus_Enum.ACTIVE;

    await promo.save();
  }

  // Handle Order Items
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.qty, sold: -item.qty },
      })
    )
  );
};

// ------- Admin --------
// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Private
export const getAllOrders = factory.getAll(Order);
