import Brand from "../models/Brand.js";
import * as factory from "./handlerFactory.js";

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = factory.getAll(Brand);

// @desc    Get specific brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandByID = factory.getOne(Brand);

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = factory.createOne(Brand);

// @desc    Update specific brand by ID
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = factory.deleteOne(Brand);
