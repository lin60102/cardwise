import { describe, expect, it } from "vitest";
import { getBestCardRecommendation, type CreditCardLike } from "../src/index.js";

const cards: CreditCardLike[] = [
  {
    id: "csp",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 95,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    rewardCategories: [
      { category: "Dining", label: "restaurants", rate: 3 },
      { category: "Travel", label: "travel booked through Chase", rate: 5 }
    ]
  },
  {
    id: "cfu",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    rewardCategories: [
      { category: "Drugstores", label: "drugstores", rate: 3 },
      { category: "Dining", label: "restaurants", rate: 3 }
    ]
  },
  {
    id: "discover",
    name: "Discover it Cash Back",
    issuer: "Discover",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    rewardCategories: [
      { category: "Groceries", label: "rotating grocery bonus", rate: 5, capAmount: 1500, capPeriod: "quarterly" }
    ]
  }
];

describe("getBestCardRecommendation", () => {
  it("ranks wallet cards by matching category reward rate", () => {
    const result = getBestCardRecommendation({
      cards,
      category: "Travel"
    });

    expect(result.bestCard?.card.name).toBe("Chase Sapphire Preferred");
    expect(result.bestCard?.effectiveRewardRate).toBe(5);
    expect(result.explanation).toContain("Use Chase Sapphire Preferred");
  });

  it("falls back to base reward rate when no category matches", () => {
    const result = getBestCardRecommendation({
      cards,
      category: "General purchase"
    });

    expect(result.bestCard?.card.name).toBe("Chase Freedom Unlimited");
    expect(result.bestCard?.effectiveRewardRate).toBe(1.5);
  });

  it("uses base rate when the spending cap has already been reached", () => {
    const result = getBestCardRecommendation({
      cards,
      category: "Groceries",
      purchaseAmount: 100,
      currentSpendByCardCategory: {
        "discover:Groceries": 1500
      }
    });

    expect(result.bestCard?.card.name).toBe("Chase Freedom Unlimited");
    expect(result.rankedCards.find((card) => card.card.id === "discover")?.capApplied).toBe(true);
  });

  it("calculates a blended rate when a purchase crosses a cap", () => {
    const result = getBestCardRecommendation({
      cards: [cards[2] as CreditCardLike],
      category: "Groceries",
      purchaseAmount: 200,
      currentSpendByCardCategory: {
        "discover:Groceries": 1400
      }
    });

    expect(result.bestCard?.effectiveRewardRate).toBe(3);
    expect(result.bestCard?.capApplied).toBe(true);
  });

  it("returns an empty state when the wallet has no cards", () => {
    const result = getBestCardRecommendation({
      cards: [],
      category: "Dining"
    });

    expect(result.bestCard).toBeNull();
    expect(result.explanation).toContain("Add cards");
  });
});
