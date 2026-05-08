import Constants from "expo-constants";
import {
  FREE_CARD_LIMIT,
  getBestCardRecommendation,
  type CreditCardLike,
  type PurchaseCategory,
  type RecommendationResult
} from "@cardwise/shared";
import {
  getCachedCard,
  getCachedCardsByIds,
  listCachedCards,
  searchCachedCards,
  upsertCardsToLocalCache
} from "./localCardCache";
import { storage, storageKeys } from "./storage";

const configuredUrl =
  process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || "http://localhost:4000";

export const API_URL = String(configuredUrl).replace(/\/$/, "");
export const DEMO_TOKEN = "__cardwise_demo_token__";

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await storage.getItem(storageKeys.authToken);
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = {};
    }

    throw new ApiError(body.error?.message ?? "Request failed.", response.status, body.error?.code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function isDemoSession() {
  return (await storage.getItem(storageKeys.authToken)) === DEMO_TOKEN;
}

async function readDemoWalletIds() {
  const stored = await storage.getItem(storageKeys.demoWallet);
  return stored ? (JSON.parse(stored) as string[]) : [];
}

async function writeDemoWalletIds(cardIds: string[]) {
  await storage.setItem(storageKeys.demoWallet, JSON.stringify(cardIds));
}

async function getDemoWalletCards(): Promise<WalletCard[]> {
  const walletIds = await readDemoWalletIds();
  const cards = await getCachedCardsByIds(walletIds);

  return cards.map((card) => ({
    id: card.id,
    addedAt: new Date().toISOString(),
    card
  }));
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  plan: "FREE" | "PREMIUM";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface WalletCard {
  id: string;
  addedAt: string;
  card: CreditCardLike;
}

export const api = {
  register: (payload: { email: string; password: string; name?: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  listCards: async () => {
    if (await isDemoSession()) {
      return { cards: await listCachedCards() };
    }

    try {
      const response = await request<{ cards: CreditCardLike[] }>("/cards");
      await upsertCardsToLocalCache(response.cards);
      return response;
    } catch (error) {
      return { cards: await listCachedCards() };
    }
  },
  searchCards: async (query: string) => {
    if (await isDemoSession()) {
      return { cards: await searchCachedCards(query) };
    }

    try {
      const response = await request<{ cards: CreditCardLike[] }>(`/cards/search?q=${encodeURIComponent(query)}`);
      await upsertCardsToLocalCache(response.cards);
      return response;
    } catch (error) {
      return { cards: await searchCachedCards(query) };
    }
  },
  getCard: async (cardId: string) => {
    if (await isDemoSession()) {
      const card = await getCachedCard(cardId);
      if (!card) {
        throw new ApiError("Credit card not found.", 404, "CARD_NOT_FOUND");
      }

      return { card };
    }

    try {
      const response = await request<{ card: CreditCardLike }>(`/cards/${cardId}`);
      await upsertCardsToLocalCache([response.card]);
      return response;
    } catch (error) {
      const cachedCard = await getCachedCard(cardId);
      if (cachedCard) {
        return { card: cachedCard };
      }

      throw error;
    }
  },
  listWallet: async () => {
    if (await isDemoSession()) {
      return { cards: await getDemoWalletCards() };
    }

    return request<{ cards: WalletCard[] }>("/user/cards");
  },
  addWalletCard: async (cardId: string) => {
    if (await isDemoSession()) {
      const walletIds = await readDemoWalletIds();
      const card = await getCachedCard(cardId);

      if (!card) {
        throw new ApiError("Credit card not found.", 404, "CARD_NOT_FOUND");
      }

      if (card.cardType === "business") {
        throw new ApiError("Business cards are available with CardWise Premium.", 402, "BUSINESS_CARDS_PREMIUM_REQUIRED");
      }

      if (!walletIds.includes(cardId) && walletIds.length >= FREE_CARD_LIMIT) {
        throw new ApiError("Free users can add up to 5 cards. Upgrade to Premium for unlimited cards.", 402, "FREE_CARD_LIMIT_REACHED");
      }

      const nextWalletIds = walletIds.includes(cardId) ? walletIds : [...walletIds, cardId];
      await writeDemoWalletIds(nextWalletIds);

      return {
        userCard: {
          id: card.id,
          addedAt: new Date().toISOString(),
          card
        }
      };
    }

    return request<{ userCard: WalletCard }>("/user/cards", {
      method: "POST",
      body: JSON.stringify({ cardId })
    });
  },
  removeWalletCard: async (walletCardId: string) => {
    if (await isDemoSession()) {
      const walletIds = await readDemoWalletIds();
      await writeDemoWalletIds(walletIds.filter((cardId) => cardId !== walletCardId));
      return;
    }

    return request<void>(`/user/cards/${walletCardId}`, {
      method: "DELETE"
    });
  },
  recommendBestCard: async (payload: { category: PurchaseCategory; purchaseAmount?: number }) => {
    if (await isDemoSession()) {
      const walletCards = await getDemoWalletCards();
      return getBestCardRecommendation({
        cards: walletCards.map((walletCard) => walletCard.card),
        category: payload.category,
        purchaseAmount: payload.purchaseAmount
      });
    }

    return request<RecommendationResult>("/recommendations/best-card", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getSubscriptionStatus: async () => {
    if (await isDemoSession()) {
      return { plan: "FREE" as const, subscription: null };
    }

    return request<{ plan: "FREE" | "PREMIUM"; subscription: unknown }>("/subscription/status");
  }
};
