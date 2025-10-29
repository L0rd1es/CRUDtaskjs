import { ObjectSchema, ValidationErrorItem } from "joi";
import { AppError, AppErrorType } from "../errors/appError";
import type { RequestHandler, Request, Response, NextFunction } from "express";

type RequestProperty = "body" | "params" | "query" | "headers";

export const validateRequest = <T = unknown>(
  schema: ObjectSchema<T>,
  property: RequestProperty = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate((req as any)[property], {
      abortEarly: false,
      stripUnknown: true,
      errors: { wrap: { label: false } },
    });

    if (!error) {
      (req as any)[property] = value;
      return next();
    }

    const errorDetails = error.details.map((detail: ValidationErrorItem) => ({
      path: detail.path.join("."),
      message: detail.message,
    }));

    next(
      new AppError(
        AppErrorType.VALIDATION,
        "Validation failed",
        400,
        errorDetails
      )
    );
  };
};
