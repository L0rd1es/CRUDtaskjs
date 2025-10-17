import { getLogger } from "log4js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

const logger = getLogger();
logger.level = "error";

export default function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(error);

  if (error instanceof AppError) {
    return sendAppError(res, error);
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}

function sendAppError(res: Response, error: AppError) {
  const defaultMessages = {
    VALIDATION: "Validation failed",
    NOT_FOUND: "Resource not found",
    FORBIDDEN: "Access denied",
    UNAUTHORIZED: "Authentication required",
  } as const;

  return res.status(error.status).json({
    type: error.type,
    message: error.message ?? defaultMessages[error.type],
    details: error.details ?? [],
  });
}
