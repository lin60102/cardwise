import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getBestCardRecommendation, PURCHASE_CATEGORIES } from "@cardwise/shared";
import { prisma } from "../db.js";
import { toApiCard } from "../mappers/cardMapper.js";
import { toDbCategory } from "../mappers/categoryMapper.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../types.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendationsRouter = Router();

recommendationsRouter.use(requireAuth);

const recommendationSchema = z.object({
  category: z.enum(PURCHASE_CATEGORIES),
  purchaseAmount: z.number().positive().optional(),
  currentSpendByCardCategory: z.record(z.number().nonnegative()).optional()
});

recommendationsRouter.post(
  "/best-card",
  asyncHandler(async (req: AuthRequest, res) => {
    const input = recommendationSchema.parse(req.body);
    const userCards = await prisma.userCard.findMany({
      where: { userId: req.user!.id },
      include: {
        card: {
          include: {
            rewardCategories: true,
            benefits: true
          }
        }
      }
    });

    const result = getBestCardRecommendation({
      cards: userCards.map((userCard) => toApiCard(userCard.card)),
      category: input.category,
      purchaseAmount: input.purchaseAmount,
      currentSpendByCardCategory: input.currentSpendByCardCategory
    });

    const logResult = JSON.parse(JSON.stringify(result)) as Prisma.InputJsonValue;

    await prisma.recommendationLog.create({
      data: {
        userId: req.user!.id,
        category: toDbCategory(input.category),
        bestCardId: result.bestCard?.card.id,
        requestAmount: input.purchaseAmount,
        result: logResult
      }
    });

    return res.json(result);
  })
);
