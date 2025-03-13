import Product from "../models/Product.js";
import Sale from "../models/SaleProducts.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";

export const checkIfProductValidAndOnSale = catchAsync(
  async (req, _res, next) => {
    const { productId } = req.body;

    const isProductExist = await Product.exists({ _id: productId });

    if (!isProductExist)
      throw new AppError("product not fount or deleted", 404);

    const product = await Sale.findOne({ productId });
    if (product) throw new AppError("Product already on sale", 400);

    next();
  }
);

// Validate to Get Active Sales
export const activeSales = (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filterObject = {
    startDate: { $lte: today }, // Start date is today or earlier
    endDate: { $gte: today },
  };
  req.filterObj = filterObject;
  next();
};

// @desc    Create Product sale
// @route   POST /api/v1/sale
// @access  Private
export const createOne = factory.createOne(Sale);

// @desc    Get Products sale
// @route   GET /api/v1/sale
// @access  Public
export const getAll = factory.getAll(Sale);

// @desc    Get Product sale
// @route   GET /api/v1/sale/:id
// @access  Public
export const getSale = factory.getOne(Sale);

// @desc    Update Product sale
// @route   PUT /api/v1/sale/:id
// @access  private
export const updateSale = factory.updateOne(Sale);

// @desc    Delete Product sale
// @route   DELETE /api/v1/sale/:id
// @access  private
export const deleteSale = factory.deleteOne(Sale);

// @desc    Delete All products on sale
// @route   DELETE /api/v1/sale
// @access  private
export const deleteAllSale = factory.dropCollection(Sale);
