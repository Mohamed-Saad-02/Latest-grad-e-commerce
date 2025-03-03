import SubCategory from "../models/SubCategory.js";
import * as factory from "./handlerFactory.js";

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
export const createSubCategory = factory.createOne(SubCategory);

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific of subcategories
// @route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategory = factory.getOne(SubCategory);

// @desc    Update subCategory
// @route   PUT  /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete subCategory
// @route   DELETE  /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = factory.deleteOne(SubCategory);
