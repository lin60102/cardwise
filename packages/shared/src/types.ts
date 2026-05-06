import type { PurchaseCategory } from "./categories.js";

export type RewardType = "cashback" | "points" | "miles";
export type PlanStatus = "FREE" | "PREMIUM";
export type CapPeriod = "monthly" | "quarterly" | "annual";
export type CardType = "personal" | "business";

export interface RewardCategoryLike {
  id?: string;
  category: PurchaseCategory;
  label?: string | null;
  rate: number;
  capAmount?: number | null;
  capPeriod?: CapPeriod | null;
}

export interface CardBenefitLike {
  id?: string;
  title: string;
  description?: string | null;
  annualValue?: number | null;
}

export interface CreditCardLike {
  id: string;
  name: string;
  issuer: string;
  cardType: CardType;
  annualFee: number;
  rewardType: RewardType;
  baseRewardRate: number;
  foreignTransactionFee: number;
  notes?: string | null;
  rewardCategories: RewardCategoryLike[];
  benefits?: CardBenefitLike[];
}

export interface RecommendationInput {
  cards: CreditCardLike[];
  category: PurchaseCategory;
  purchaseAmount?: number;
  currentSpendByCardCategory?: Record<string, number>;
}

export interface RankedCardRecommendation {
  card: CreditCardLike;
  matchedCategory?: RewardCategoryLike;
  effectiveRewardRate: number;
  displayedRate: number;
  estimatedRewardAmount: number;
  estimatedRewardUnit: "dollars" | "points" | "miles";
  capApplied: boolean;
  explanation: string;
}

export interface RecommendationResult {
  category: PurchaseCategory;
  purchaseAmount: number;
  bestCard: RankedCardRecommendation | null;
  rankedCards: RankedCardRecommendation[];
  explanation: string;
}
