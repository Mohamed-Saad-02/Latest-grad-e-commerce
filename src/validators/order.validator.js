import Joi from "joi";

export const addOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        qty: Joi.number().required(),
        product: Joi.string().required(),
      })
    )
    .required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
  promoCode: Joi.string().optional(),
});
