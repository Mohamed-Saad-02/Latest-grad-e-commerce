import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  image: Joi.string().optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
  image: Joi.string().optional(),
});
