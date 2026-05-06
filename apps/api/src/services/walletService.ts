import { Prisma } from "@prisma/client";
import { FREE_CARD_LIMIT } from "@cardwise/shared";
import { prisma } from "../db.js";
import { AppError } from "../utils/errors.js";

export async function addCardToWallet(userId: string, cardId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const [subscription, cardCount, card] = await Promise.all([
            tx.subscription.findUnique({ where: { userId } }),
            tx.userCard.count({ where: { userId } }),
            tx.creditCard.findUnique({ where: { id: cardId } })
          ]);

          if (!card) {
            throw new AppError(404, "Credit card not found.", "CARD_NOT_FOUND");
          }

          const isPremium = subscription?.plan === "PREMIUM";

          if (!isPremium && card.cardType === "business") {
            throw new AppError(
              402,
              "Business cards are available with CardWise Premium.",
              "BUSINESS_CARDS_PREMIUM_REQUIRED"
            );
          }

          if (!isPremium && cardCount >= FREE_CARD_LIMIT) {
            throw new AppError(
              402,
              `Free users can add up to ${FREE_CARD_LIMIT} cards. Upgrade to Premium for unlimited cards.`,
              "FREE_CARD_LIMIT_REACHED"
            );
          }

          return tx.userCard.create({
            data: {
              userId,
              cardId
            },
            include: {
              card: {
                include: {
                  rewardCategories: true,
                  benefits: true
                }
              }
            }
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        }
      );
    } catch (error) {
      const shouldRetry =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 2;

      if (!shouldRetry) {
        throw error;
      }
    }
  }

  throw new AppError(409, "Please try adding the card again.", "WALLET_RETRY_REQUIRED");
}
