import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { isAppError } from "../utils/errors.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Please check the submitted fields.",
        issues: error.flatten()
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "A record with those details already exists."
      }
    });
  }

  console.error(error);
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong."
    }
  });
};

