import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../types.js";
import { prisma } from "../db.js";
import { toApiCard } from "../mappers/cardMapper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addCardToWallet } from "../services/walletService.js";
import { AppError } from "../utils/errors.js";

export const userCardsRouter = Router();

userCardsRouter.use(requireAuth);

userCardsRouter.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const userCards = await prisma.userCard.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        card: {
          include: {
            rewardCategories: true,
            benefits: true
          }
        }
      }
    });

    return res.json({
      cards: userCards.map((userCard) => ({
        id: userCard.id,
        addedAt: userCard.createdAt,
        card: toApiCard(userCard.card)
      }))
    });
  })
);

userCardsRouter.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const input = z.object({ cardId: z.string().min(1) }).parse(req.body);
    const userCard = await addCardToWallet(req.user!.id, input.cardId);

    return res.status(201).json({
      userCard: {
        id: userCard.id,
        addedAt: userCard.createdAt,
        card: toApiCard(userCard.card)
      }
    });
  })
);

userCardsRouter.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const userCard = await prisma.userCard.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!userCard) {
      throw new AppError(404, "Wallet card not found.", "USER_CARD_NOT_FOUND");
    }

    await prisma.userCard.delete({ where: { id: userCard.id } });

    return res.status(204).send();
  })
);

