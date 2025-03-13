import * as factory from "./handlerFactory.js";
import Category from "../models/Category.js";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = catchAsync(async (req, res, next) => {
  const numCategories = await Category.countDocuments();

  const features = new APIFeatures(Category.find(), req.query)
    .limitFields()
    .paginate(numCategories);

  const categories = await features.query.populate({
    path: "subCategory",
    select: "name",
  });

  const metadata = features?.metadata?.limit
    ? {
        limit: features.metadata.limit,
        results: doc.length,
        total: documentsCount,
        page: features.metadata.page,
        totalPages: features.metadata.totalPages,
      }
    : undefined;

  res.status(200).json({
    status: "success",
    metadata,
    categories,
  });
});

// @desc    Get specific category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryByID = factory.getOne(Category);

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = factory.createOne(Category);

// @desc    Update specific category by ID
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = factory.updateOne(Category);

// @desc    Delete specific category by ID
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = factory.deleteOne(Category);
