import type {
  CreditCardLike,
  RankedCardRecommendation,
  RecommendationInput,
  RecommendationResult,
  RewardCategoryLike
} from "./types.js";

const DEFAULT_PURCHASE_AMOUNT = 100;

function formatRate(card: CreditCardLike, rate: number): string {
  if (card.rewardType === "cashback") {
    return `${trimRate(rate)}%`;
  }

  return `${trimRate(rate)}x`;
}

function trimRate(rate: number): string {
  return Number.isInteger(rate) ? String(rate) : rate.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function findCategoryMatch(card: CreditCardLike, category: string): RewardCategoryLike | undefined {
  return card.rewardCategories.find((rewardCategory) => rewardCategory.category === category);
}

function getSpendKey(cardId: string, category: string): string {
  return `${cardId}:${category}`;
}

function calculateEffectiveRate(
  card: CreditCardLike,
  matchedCategory: RewardCategoryLike | undefined,
  purchaseAmount: number,
  currentSpendByCardCategory: Record<string, number>
): { effectiveRewardRate: number; displayedRate: number; capApplied: boolean } {
  const categoryRate = matchedCategory?.rate ?? card.baseRewardRate;

  if (!matchedCategory?.capAmount || matchedCategory.capAmount <= 0) {
    return {
      effectiveRewardRate: categoryRate,
      displayedRate: categoryRate,
      capApplied: false
    };
  }

  const spendKey = getSpendKey(card.id, matchedCategory.category);
  const currentSpend = currentSpendByCardCategory[spendKey] ?? 0;
  const remainingCap = Math.max(matchedCategory.capAmount - currentSpend, 0);

  if (remainingCap >= purchaseAmount) {
    return {
      effectiveRewardRate: categoryRate,
      displayedRate: categoryRate,
      capApplied: false
    };
  }

  if (remainingCap <= 0) {
    return {
      effectiveRewardRate: card.baseRewardRate,
      displayedRate: categoryRate,
      capApplied: true
    };
  }

  // For a purchase that crosses a spending cap, rank by the blended rate the user will actually earn.
  const cappedRewards = remainingCap * categoryRate;
  const baseRewards = (purchaseAmount - remainingCap) * card.baseRewardRate;
  const effectiveRewardRate = (cappedRewards + baseRewards) / purchaseAmount;

  return {
    effectiveRewardRate,
    displayedRate: categoryRate,
    capApplied: true
  };
}

function buildCardExplanation(
  card: CreditCardLike,
  category: string,
  matchedCategory: RewardCategoryLike | undefined,
  effectiveRewardRate: number,
  capApplied: boolean
): string {
  const categoryLabel = matchedCategory?.label ?? category.toLowerCase();
  const rewardPhrase = matchedCategory
    ? `earns ${formatRate(card, matchedCategory.rate)} on ${categoryLabel}`
    : `earns its base ${formatRate(card, card.baseRewardRate)} rate`;
  const capPhrase = capApplied ? ` after applying the card's spending cap` : "";

  return `${card.name} ${rewardPhrase}${capPhrase}. Effective rate: ${formatRate(card, effectiveRewardRate)}.`;
}

export function getBestCardRecommendation(input: RecommendationInput): RecommendationResult {
  const purchaseAmount = input.purchaseAmount && input.purchaseAmount > 0 ? input.purchaseAmount : DEFAULT_PURCHASE_AMOUNT;

  const rankedCards = input.cards
    .map<RankedCardRecommendation>((card) => {
      const matchedCategory = findCategoryMatch(card, input.category);
      const rateResult = calculateEffectiveRate(
        card,
        matchedCategory,
        purchaseAmount,
        input.currentSpendByCardCategory ?? {}
      );

      return {
        card,
        matchedCategory,
        effectiveRewardRate: rateResult.effectiveRewardRate,
        displayedRate: rateResult.displayedRate,
        capApplied: rateResult.capApplied,
        explanation: buildCardExplanation(
          card,
          input.category,
          matchedCategory,
          rateResult.effectiveRewardRate,
          rateResult.capApplied
        )
      };
    })
    .sort((left, right) => {
      if (right.effectiveRewardRate !== left.effectiveRewardRate) {
        return right.effectiveRewardRate - left.effectiveRewardRate;
      }

      return left.card.annualFee - right.card.annualFee;
    });

  const bestCard = rankedCards[0] ?? null;

  if (!bestCard) {
    return {
      category: input.category,
      bestCard: null,
      rankedCards: [],
      explanation: "Add cards to your wallet to get a recommendation."
    };
  }

  const categoryText = input.category.toLowerCase();
  const rewardText = formatRate(bestCard.card, bestCard.effectiveRewardRate);
  const sourceText = bestCard.matchedCategory
    ? `${bestCard.matchedCategory.label ?? categoryText}`
    : "general purchases";

  return {
    category: input.category,
    bestCard,
    rankedCards,
    explanation: `Use ${bestCard.card.name} for ${categoryText} because it earns ${rewardText} on ${sourceText}, which is higher than your other cards for this category.`
  };
}

