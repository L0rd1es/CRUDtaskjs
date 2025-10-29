import Joi, { ObjectSchema } from "joi";
import { productDTO } from "../DTO/product.dto";

export const productSchema: ObjectSchema<productDTO> = Joi.object<productDTO>({
  name: Joi.string()
    .regex(/^[A-Za-z]+$/)
    .trim()
    .min(3)
    .max(30)
    .required(),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .prefs({ convert: true }),
});

export const productIdSchema: ObjectSchema = Joi.object({
  productId: Joi.number()
    .positive()
    .integer()
    .required()
    .prefs({ convert: true }),
});
