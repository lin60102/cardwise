import crypto from "node:crypto";
import { Router } from "express";
import { prisma } from "../db.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../types.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { syncRevenueCatWebhook } from "../services/subscriptionService.js";

export const subscriptionRouter = Router();

subscriptionRouter.get(
  "/status",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    return res.json({
      plan: subscription?.plan ?? "FREE",
      subscription
    });
  })
);

subscriptionRouter.post(
  "/webhook/revenuecat",
  asyncHandler(async (req, res) => {
    if (env.REVENUECAT_WEBHOOK_SECRET) {
      const signature = req.header("x-revenuecat-signature");
      const expected = crypto
        .createHmac("sha256", env.REVENUECAT_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (
        !signature ||
        signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
      ) {
        throw new AppError(401, "Invalid RevenueCat webhook signature.", "INVALID_WEBHOOK_SIGNATURE");
      }
    }

    const subscription = await syncRevenueCatWebhook(req.body);

    return res.json({
      received: true,
      subscription
    });
  })
);
