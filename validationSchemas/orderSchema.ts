import Joi, { ObjectSchema } from "joi";
import { orderDTO } from "../DTO/order.dto";

export const orderSchema: ObjectSchema<orderDTO> = Joi.object<orderDTO>({
  userId: Joi.number().positive().integer().required().prefs({ convert: true }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number()
          .positive()
          .integer()
          .required()
          .prefs({ convert: true }),
        quantity: Joi.number()
          .positive()
          .integer()
          .required()
          .prefs({ convert: true }),
      })
    )
    .min(1)
    .required(),
});

export const orderIdSchema: ObjectSchema = Joi.object({
  orderId: Joi.number()
    .positive()
    .integer()
    .required()
    .prefs({ convert: true }),
});
