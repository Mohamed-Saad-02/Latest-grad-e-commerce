import PromoCode from "../models/PromoCode.js";
import * as factory from "./handlerFactory.js";

// @desc    Get list of PromoCodes
// @route   GET /api/v1/promoCodes
// @access  private
export const getAllPromoCodes = factory.getAll(PromoCode);

// @desc    Get PromoCode detail
// @route   GET /api/v1/promoCodes/:id
// @access  private
export const getPromoCode = factory.getOne(PromoCode);

// @desc    Add PromoCode
// @route   POST /api/v1/promoCodes
// @access  private
export const addPromoCode = factory.createOne(PromoCode);

// @desc    Update PromoCode
// @route   PUT /api/v1/promoCodes/:id
// @access  private
export const updatePromoCode = factory.updateOne(PromoCode);

// @desc    Delete PromoCode
// @route   DELETE /api/v1/promoCodes/:id
// @access  private
export const deletePromoCode = factory.deleteOne(PromoCode);
