import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db.js";
import type { AuthRequest } from "../types.js";
import { AppError } from "../utils/errors.js";
import { verifyAuthToken } from "../utils/auth.js";
import { getEffectivePlan } from "../services/subscriptionService.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

    if (!token) {
      throw new AppError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { subscription: true }
    });

    if (!user) {
      throw new AppError(401, "Invalid authentication token.", "INVALID_TOKEN");
    }

    (req as AuthRequest).user = {
      id: user.id,
      email: user.email,
      plan: getEffectivePlan(user.subscription)
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, "Invalid authentication token.", "INVALID_TOKEN"));
  }
}
