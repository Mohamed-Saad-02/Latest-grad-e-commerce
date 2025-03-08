import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";

export const createFilterObj = (req, res, next) => {
  let filterObject = {};

  if (req.query.ids)
    filterObject = {
      _id: {
        $in: req.query.ids.split(","),
      },
    };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of top sale products
// @route   GET /api/v1/products/top-sale
// @access  Public
export const getTopSale = catchAsync(async (req, res, next) => {
  const { limit } = req.query;

  const products = await Product.aggregate([
    { $sort: { sale: -1 } },
    { $limit: limit || 10 },
  ]);

  res.status(200).json({ status: "success", data: products });
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = factory.getAll(Product, ["ids"], "name");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = factory.getOne(Product);

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
export const createProduct = factory.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = factory.deleteOne(Product);

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
export const getRelatedProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new AppError("Product not found", 404));

  // Create filterObj and path for getAll middleware
  req.filterObj = {
    _id: { $ne: id },
    category: product.category,
  };

  next();
});
