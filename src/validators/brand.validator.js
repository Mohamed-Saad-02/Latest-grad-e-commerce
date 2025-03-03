import Joi from "joi";

export const createBrandSchema = Joi.object({
  name: Joi.string().trim().required(),
  image: Joi.string().optional(),
});
