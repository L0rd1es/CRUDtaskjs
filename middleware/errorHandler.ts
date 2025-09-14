import { getLogger } from "log4js";
import { Request, Response, NextFunction } from "express";

const logger = getLogger();
logger.level = "error";

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(error);

  switch (error.type) {
    case "VALIDATION": {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: error.message ?? "Validation failed",
          details: error.details ?? [],
        },
      });
    }
    case "NOT_FOUND": {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: error.message ?? "Resource not found",
          details: error.details ?? [],
        },
      });
    }
    case "INTERNAL_ERROR": {
      return res.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: error.message ?? "Unexpected server error",
          details: error.details ?? [],
        },
      });
    }
    default: {
      return res.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: error.message ?? "Unexpected server error",
          details: error.details ?? [],
        },
      });
    }
  }
}
