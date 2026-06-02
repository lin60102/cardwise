import {
  getBestCardRecommendation,
  type CreditCardLike,
  type PurchaseCategory,
  type RecommendationResult
} from "@cardwise/shared";
import { DEMO_CARDS } from "./demoData";
import type { AuthUser, WalletCard } from "./api";

const screenshotModeEnvValue = process.env.EXPO_PUBLIC_SCREENSHOT_MODE;

export const isScreenshotMode = screenshotModeEnvValue === "true";

export type ScreenshotStartScreen = "onboarding" | "wallet" | "recommendation" | "annualDashboard" | "paywall";

export const screenshotStartScreen = (process.env.EXPO_PUBLIC_SCREENSHOT_START ?? "wallet") as ScreenshotStartScreen;

export function getScreenshotModeDebugState() {
  return {
    enabled: isScreenshotMode,
    rawMode: screenshotModeEnvValue ?? null,
    rawStart: process.env.EXPO_PUBLIC_SCREENSHOT_START ?? null,
    startScreen: screenshotStartScreen
  };
}

const SCREENSHOT_CARD_IDS = [
  "demo-amex-gold",
  "demo-bcp",
  "demo-venture-x",
  "demo-custom-cash",
  "demo-csp",
  "demo-ink-cash"
];

function requireCard(cardId: string) {
  const card = DEMO_CARDS.find((item) => item.id === cardId);
  if (!card) {
    throw new Error(`Missing screenshot card: ${cardId}`);
  }

  return card;
}

function withScreenshotCredits(card: CreditCardLike): CreditCardLike {
  const annualValueByCardId: Record<string, number> = {
    "demo-amex-gold": 240,
    "demo-bcp": 84,
    "demo-venture-x": 400,
    "demo-custom-cash": 180,
    "demo-csp": 50,
    "demo-ink-cash": 300
  };

  const annualValue = annualValueByCardId[card.id];
  if (!annualValue) {
    return card;
  }

  return {
    ...card,
    benefits: [{
      id: `${card.id}-screenshot-value`,
      title: "Estimated annual value",
      annualValue
    }]
  };
}

export const screenshotUser: AuthUser = {
  id: "screenshot-user",
  email: "member@cardwise.app",
  name: "CardWise Member",
  plan: "PREMIUM"
};

export function getScreenshotWalletCards(): WalletCard[] {
  return SCREENSHOT_CARD_IDS.map((cardId, index) => {
    const card = withScreenshotCredits(requireCard(cardId));
    return {
      id: `screenshot-wallet-${card.id}`,
      addedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
      card
    };
  });
}

export function getScreenshotRecommendation(category: PurchaseCategory = "Groceries"): RecommendationResult {
  return getBestCardRecommendation({
    cards: getScreenshotWalletCards().map((walletCard) => walletCard.card),
    category,
    purchaseAmount: 1500
  });
}
