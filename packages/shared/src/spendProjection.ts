import type { PurchaseCategory } from "./categories.js";
import { getBestCardRecommendation } from "./recommendationEngine.js";
import type { CreditCardLike, RankedCardRecommendation } from "./types.js";

export interface RewardTotals {
  dollars: number;
  points: number;
  miles: number;
}

export interface SpendProjectionRow {
  category: PurchaseCategory;
  annualSpend: number;
  primaryCardName: string | null;
  rewardTotals: RewardTotals;
}

export interface SpendProjectionInput {
  cards: CreditCardLike[];
  categories: PurchaseCategory[];
  monthlySpendByCategory: Partial<Record<PurchaseCategory, number>>;
}

function createRewardTotals(): RewardTotals {
  return { dollars: 0, points: 0, miles: 0 };
}

function getSpendKey(recommendation: RankedCardRecommendation, category: PurchaseCategory) {
  return `${recommendation.card.id}:${category}`;
}

export function getSpendProjection(input: SpendProjectionInput) {
  const rows = input.categories
    .map((category) => {
      const monthlySpend = input.monthlySpendByCategory[category] ?? 0;
      if (monthlySpend <= 0) {
        return null;
      }

      const rewardTotals = createRewardTotals();
      const annualSpendByCardCategory: Record<string, number> = {};
      let quarterlySpendByCardCategory: Record<string, number> = {};
      const cardWinCounts: Record<string, number> = {};

      for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
        if (monthIndex > 0 && monthIndex % 3 === 0) {
          quarterlySpendByCardCategory = {};
        }

        const recommendation = getBestCardRecommendation({
          cards: input.cards,
          category,
          purchaseAmount: monthlySpend,
          currentSpendByCardCategory: {
            ...annualSpendByCardCategory,
            ...quarterlySpendByCardCategory
          }
        });
        const bestCard = recommendation.bestCard;

        if (!bestCard) {
          continue;
        }

        rewardTotals[bestCard.estimatedRewardUnit] += bestCard.estimatedRewardAmount;
        cardWinCounts[bestCard.card.name] = (cardWinCounts[bestCard.card.name] ?? 0) + 1;

        const capPeriod = bestCard.matchedCategory?.capPeriod;
        const spendKey = getSpendKey(bestCard, category);
        if (capPeriod === "annual") {
          annualSpendByCardCategory[spendKey] = (annualSpendByCardCategory[spendKey] ?? 0) + monthlySpend;
        } else if (capPeriod === "quarterly") {
          quarterlySpendByCardCategory[spendKey] = (quarterlySpendByCardCategory[spendKey] ?? 0) + monthlySpend;
        }
      }

      return {
        category,
        annualSpend: monthlySpend * 12,
        primaryCardName: Object.entries(cardWinCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null,
        rewardTotals
      };
    })
    .filter((row): row is SpendProjectionRow => Boolean(row));

  const totals = rows.reduce((summary, row) => {
    summary.dollars += row.rewardTotals.dollars;
    summary.points += row.rewardTotals.points;
    summary.miles += row.rewardTotals.miles;
    return summary;
  }, createRewardTotals());

  return { rows, totals };
}

export function formatRewardTotals(rewardTotals: RewardTotals) {
  const pieces = [];

  if (rewardTotals.dollars > 0) {
    pieces.push(`$${rewardTotals.dollars.toFixed(2)}`);
  }

  if (rewardTotals.points > 0) {
    pieces.push(`${Math.round(rewardTotals.points).toLocaleString()} points`);
  }

  if (rewardTotals.miles > 0) {
    pieces.push(`${Math.round(rewardTotals.miles).toLocaleString()} miles`);
  }

  return pieces.join(" - ");
}
