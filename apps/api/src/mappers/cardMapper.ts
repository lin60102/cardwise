import type { CardBenefit, CreditCard, RewardCategory } from "@prisma/client";
import type { CreditCardLike } from "@cardwise/shared";
import { toApiCategory } from "./categoryMapper.js";

type CardWithRewards = CreditCard & {
  rewardCategories: RewardCategory[];
  benefits: CardBenefit[];
};

export function toApiCard(card: CardWithRewards): CreditCardLike {
  return {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    cardType: card.cardType,
    annualFee: Number(card.annualFee),
    rewardType: card.rewardType,
    baseRewardRate: card.baseRewardRate,
    foreignTransactionFee: card.foreignTransactionFee,
    notes: card.notes,
    rewardCategories: card.rewardCategories.map((rewardCategory) => ({
      id: rewardCategory.id,
      category: toApiCategory(rewardCategory.category),
      label: rewardCategory.label,
      rate: rewardCategory.rate,
      capAmount: rewardCategory.capAmount === null ? null : Number(rewardCategory.capAmount),
      capPeriod: rewardCategory.capPeriod as CreditCardLike["rewardCategories"][number]["capPeriod"]
    })),
    benefits: card.benefits.map((benefit) => ({
      id: benefit.id,
      title: benefit.title,
      description: benefit.description,
      annualValue: benefit.annualValue === null ? null : Number(benefit.annualValue)
    }))
  };
}
