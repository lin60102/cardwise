import { FREE_CARD_LIMIT } from "@cardwise/shared";
import { prisma } from "../db.js";
import { AppError } from "../utils/errors.js";

export async function addCardToWallet(userId: string, cardId: string) {
  const [subscription, cardCount, card] = await prisma.$transaction([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.userCard.count({ where: { userId } }),
    prisma.creditCard.findUnique({ where: { id: cardId } })
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

  return prisma.userCard.create({
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
}
