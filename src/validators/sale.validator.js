import Joi from "joi";
import { DiscountType_Enum } from "../constants/constants.js";

const customValidateDiscountHelper = (value, helpers) => {
  const { discountType } = helpers.state.ancestors[0]; // Get the discountType value

  // If discount type is PERCENTAGE, ensure value is ≤ 100
  if (discountType === DiscountType_Enum.PERCENTAGE && value > 100) {
    return helpers.error("any.invalid", {
      message: "Percentage discount cannot exceed 100%",
    });
  }

  return value; // Return valid value
};

// Get current date without time (only YYYY-MM-DD)
const today = new Date();
today.setHours(0, 0, 0, 0);

export const saleValidationSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Ensures it's a valid MongoDB ObjectId
    .required(),

  discount: Joi.object({
    discountType: Joi.string()
      .valid(...Object.values(DiscountType_Enum))
      .required(),

    discountValue: Joi.number()
      .positive()
      .custom(customValidateDiscountHelper)
      .required(),
  }).required(),

  startDate: Joi.date()
    .min(today) // Must be today or a future date
    .required(),

  endDate: Joi.date()
    .greater(Joi.ref("startDate")) // Ensure endDate is after startDate
    .required(),
});

export const updateSaleValidationSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(), // Product ID is optional since it's an update

  discount: Joi.object({
    discountType: Joi.string()
      .valid(...Object.values(DiscountType_Enum))
      .optional(),

    discountValue: Joi.number()
      .positive()
      .custom(customValidateDiscountHelper)
      .when("discountType", { is: Joi.exist(), then: Joi.required() })
      .optional(),
  }).optional(),

  startDate: Joi.date()
    .min(today) // Start date cannot be in the past
    .optional(),

  endDate: Joi.date()
    .greater(Joi.ref("startDate")) // Ensure endDate is after startDate (if both exist)
    .optional(),
})
  .min(1)
  .message("At least update one");
