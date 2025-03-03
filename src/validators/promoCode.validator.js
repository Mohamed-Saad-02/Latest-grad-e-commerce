import Joi from "joi";
import {
  DiscountType_Enum,
  PromoCodeStatus_Enum,
} from "../constants/constants.js";

// Custom validator function
const discountTypeValidator = (value, helpers) => {
  const { discountType } = helpers.state.ancestors[0];

  if (discountType === DiscountType_Enum.PERCENTAGE && value > 100) {
    return helpers.message(
      "Discount value cannot exceed 100% for percentage discounts"
    );
  }
  return value; // Return the value if validation passes
};

export const addPromoCodeValidator = Joi.object({
  code: Joi.string().required(),
  maxUsage: Joi.number().optional(),
  discount: Joi.object({
    discountType: Joi.string()
      .valid(...Object.values(DiscountType_Enum))
      .default(DiscountType_Enum.PERCENTAGE),
    value: Joi.number().required().custom(discountTypeValidator),
  }).required(),
  expiredAt: Joi.date().optional(),
  status: Joi.string()
    .valid(...Object.values(PromoCodeStatus_Enum))
    .default(PromoCodeStatus_Enum.ACTIVE),
});

export const updatePromoCodeValidator = Joi.object({
  code: Joi.string().optional(),
  maxUsage: Joi.number().optional(),
  discount: Joi.object({
    discountType: Joi.string()
      .valid(...Object.values(DiscountType_Enum))
      .default(DiscountType_Enum.PERCENTAGE),
    value: Joi.number().required().custom(discountTypeValidator),
  }).optional(),
  expiredAt: Joi.date().optional(),
  status: Joi.string()
    .valid(...Object.values(PromoCodeStatus_Enum))
    .default(PromoCodeStatus_Enum.ACTIVE),
});
