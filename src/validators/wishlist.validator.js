import Joi from "joi";

export const addWishlistValidator = Joi.object({
  product: Joi.string().required(),
});

export const updateWishlistValidator = Joi.object({
  product: Joi.string().required(),
});
