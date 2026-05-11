import type { RankedCardRecommendation, RewardType } from "./types.js";

interface RewardRateFormatOptions {
  fractionDigits?: number;
  trimTrailingZeros?: boolean;
}

function normalizeRateValue(rate: number, fractionDigits: number, trimTrailingZeros: boolean) {
  const value = Number.isInteger(rate) ? String(rate) : rate.toFixed(fractionDigits);
  return trimTrailingZeros ? value.replace(/0+$/, "").replace(/\.$/, "") : value;
}

export function formatRewardRate(rate: number, rewardType: RewardType, options: RewardRateFormatOptions = {}) {
  const value = normalizeRateValue(rate, options.fractionDigits ?? 2, options.trimTrailingZeros ?? false);
  return rewardType === "cashback" ? `${value}%` : `${value}x`;
}

export function formatEstimatedReward(recommendation: RankedCardRecommendation) {
  const amount = recommendation.estimatedRewardAmount;

  if (recommendation.estimatedRewardUnit === "dollars") {
    return `$${amount.toFixed(2)}`;
  }

  const roundedAmount = Math.round(amount).toLocaleString();
  return `${roundedAmount} ${recommendation.estimatedRewardUnit}`;
}
