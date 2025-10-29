import Joi, { ObjectSchema } from "joi";
import { userDTO } from "../DTO/user.dto";

export const userSchema: ObjectSchema<userDTO> = Joi.object<userDTO>({
  name: Joi.string()
    .regex(/^[A-Za-z]+$/)
    .trim()
    .min(3)
    .max(30)
    .required(),
  surname: Joi.string()
    .regex(/^[A-Za-z]+$/)
    .trim()
    .min(3)
    .max(30)
    .required(),
});

export const userIdSchema: ObjectSchema = Joi.object({
  userId: Joi.number().positive().integer().required().prefs({ convert: true }),
});
