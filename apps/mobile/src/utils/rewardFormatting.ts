import type { RankedCardRecommendation } from "@cardwise/shared";

export function formatEstimatedReward(recommendation: RankedCardRecommendation) {
  const amount = recommendation.estimatedRewardAmount;

  if (recommendation.estimatedRewardUnit === "dollars") {
    return `$${amount.toFixed(2)}`;
  }

  const roundedAmount = Math.round(amount).toLocaleString();
  return `${roundedAmount} ${recommendation.estimatedRewardUnit}`;
}

