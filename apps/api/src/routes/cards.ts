import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { toApiCard } from "../mappers/cardMapper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

export const cardsRouter = Router();

cardsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cards = await prisma.creditCard.findMany({
      orderBy: { name: "asc" },
      include: {
        rewardCategories: true,
        benefits: true
      }
    });

    return res.json({ cards: cards.map(toApiCard) });
  })
);

cardsRouter.get(
  "/search",
  asyncHandler(async (req, res) => {
    const query = z.string().trim().default("").parse(req.query.q);
    const cards = await prisma.creditCard.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { issuer: { contains: query, mode: "insensitive" } }
            ]
          }
        : undefined,
      orderBy: { name: "asc" },
      take: 30,
      include: {
        rewardCategories: true,
        benefits: true
      }
    });

    return res.json({ cards: cards.map(toApiCard) });
  })
);

cardsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const card = await prisma.creditCard.findUnique({
      where: { id: req.params.id },
      include: {
        rewardCategories: true,
        benefits: true
      }
    });

    if (!card) {
      throw new AppError(404, "Credit card not found.", "CARD_NOT_FOUND");
    }

    return res.json({ card: toApiCard(card) });
  })
);

