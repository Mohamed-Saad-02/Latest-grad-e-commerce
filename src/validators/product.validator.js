import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  subCategory: Joi.string().optional(),
  images: Joi.array().max(4).items(Joi.string()).required(),
  status: Joi.string().valid("inStock", "outStock").required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  price: Joi.number().optional(),
  quantity: Joi.number().optional(),
  category: Joi.string().optional(),
  brand: Joi.string().optional(),
  subCategory: Joi.string().optional(),
  images: Joi.array().max(4).items(Joi.string()).optional(),
  status: Joi.string().valid("inStock", "outStock").optional(),
});
