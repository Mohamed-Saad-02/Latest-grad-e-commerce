import Joi from "joi";

export const createSubCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().required(),
});
