import { describe, expect, it } from "vitest";
import { formatEstimatedReward, formatRewardRate, type RankedCardRecommendation } from "../src/index.js";

const baseRecommendation = {
  card: {
    id: "sample",
    name: "Sample Card",
    issuer: "CardWise",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    rewardCategories: []
  },
  effectiveRewardRate: 1,
  displayedRate: 1,
  capApplied: false,
  explanation: "Sample"
} satisfies Omit<RankedCardRecommendation, "estimatedRewardAmount" | "estimatedRewardUnit">;

describe("reward formatting", () => {
  it("formats cashback and points rates with the recommendation screen precision by default", () => {
    expect(formatRewardRate(3, "cashback")).toBe("3%");
    expect(formatRewardRate(1.5, "cashback")).toBe("1.50%");
    expect(formatRewardRate(2.25, "points")).toBe("2.25x");
  });

  it("can preserve the existing compact recommendation explanation format", () => {
    expect(formatRewardRate(1.5, "cashback", { trimTrailingZeros: true })).toBe("1.5%");
    expect(formatRewardRate(2.5, "points", { trimTrailingZeros: true })).toBe("2.5x");
  });

  it("can match card summary one-decimal formatting", () => {
    expect(formatRewardRate(1.25, "cashback", { fractionDigits: 1 })).toBe("1.3%");
    expect(formatRewardRate(1.25, "miles", { fractionDigits: 1 })).toBe("1.3x");
  });

  it("formats estimated reward amounts for dollars, points, and miles", () => {
    expect(
      formatEstimatedReward({
        ...baseRecommendation,
        estimatedRewardAmount: 1.5,
        estimatedRewardUnit: "dollars"
      })
    ).toBe("$1.50");
    expect(
      formatEstimatedReward({
        ...baseRecommendation,
        estimatedRewardAmount: 1250.4,
        estimatedRewardUnit: "points"
      })
    ).toBe("1,250 points");
    expect(
      formatEstimatedReward({
        ...baseRecommendation,
        estimatedRewardAmount: 999.6,
        estimatedRewardUnit: "miles"
      })
    ).toBe("1,000 miles");
  });
});
