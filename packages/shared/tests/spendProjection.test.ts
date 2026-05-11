import { describe, expect, it } from "vitest";
import { formatRewardTotals, getSpendProjection, type CreditCardLike } from "../src/index.js";

const cards: CreditCardLike[] = [
  {
    id: "base-cashback",
    name: "Base Cashback",
    issuer: "CardWise",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1.5,
    foreignTransactionFee: 0,
    rewardCategories: []
  },
  {
    id: "grocery-cap",
    name: "Grocery Cap",
    issuer: "CardWise",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    rewardCategories: [
      { category: "Groceries", label: "groceries", rate: 5, capAmount: 1500, capPeriod: "quarterly" }
    ]
  },
  {
    id: "dining-points",
    name: "Dining Points",
    issuer: "CardWise",
    cardType: "personal",
    annualFee: 95,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    rewardCategories: [{ category: "Dining", label: "restaurants", rate: 3 }]
  }
];

describe("getSpendProjection", () => {
  it("projects annual spend rewards by repeatedly using the recommendation engine", () => {
    const projection = getSpendProjection({
      cards,
      categories: ["Dining", "Groceries", "Gas"],
      monthlySpendByCategory: {
        Dining: 100,
        Groceries: 600
      }
    });

    expect(projection.rows).toHaveLength(2);
    expect(projection.rows[0]).toMatchObject({
      category: "Dining",
      annualSpend: 1200,
      primaryCardName: "Dining Points",
      rewardTotals: {
        dollars: 0,
        points: 3600,
        miles: 0
      }
    });
    expect(projection.rows[1]).toMatchObject({
      category: "Groceries",
      annualSpend: 7200,
      primaryCardName: "Grocery Cap",
      rewardTotals: {
        dollars: 312,
        points: 0,
        miles: 0
      }
    });
    expect(projection.totals).toEqual({
      dollars: 312,
      points: 3600,
      miles: 0
    });
  });

  it("formats projected totals with the existing display order and separators", () => {
    expect(formatRewardTotals({ dollars: 12.5, points: 1500.4, miles: 999.6 })).toBe(
      "$12.50 - 1,500 points - 1,000 miles"
    );
    expect(formatRewardTotals({ dollars: 0, points: 0, miles: 0 })).toBe("");
  });
});
