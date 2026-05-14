import { prisma } from "../db.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

interface SubscriptionState {
  plan: "FREE" | "PREMIUM";
  expiresAt?: Date | null;
  lifetime?: boolean;
  entitlementIdentifier?: string | null;
}

export function getEffectivePlan(subscription: SubscriptionState | null | undefined, now = new Date()) {
  if (!subscription || subscription.plan !== "PREMIUM") {
    return "FREE";
  }

  if (subscription.lifetime || !subscription.expiresAt || subscription.expiresAt > now) {
    return "PREMIUM";
  }

  return "FREE";
}

interface RevenueCatWebhookEvent {
  event?: {
    app_user_id?: string;
    type?: string;
    product_id?: string;
    entitlement_id?: string;
    expiration_at_ms?: number | null;
  };
}

interface RevenueCatSubscriberEntitlement {
  product_identifier?: string | null;
  expires_date?: string | null;
}

interface RevenueCatSubscriberResponse {
  subscriber?: {
    entitlements?: Record<string, RevenueCatSubscriberEntitlement | undefined>;
  };
}

export interface RevenueCatEntitlementSnapshot {
  entitlementIdentifier: string;
  productIdentifier: string | null;
  expiresAt: Date | null;
  lifetime: boolean;
}

function isPromoPremium(subscription: SubscriptionState | null | undefined) {
  return subscription?.entitlementIdentifier === "promo" && getEffectivePlan(subscription) === "PREMIUM";
}

export function readRevenueCatEntitlement(
  payload: RevenueCatSubscriberResponse,
  entitlementIdentifier: string,
  now = new Date()
): RevenueCatEntitlementSnapshot | null {
  const entitlement = payload.subscriber?.entitlements?.[entitlementIdentifier];

  if (!entitlement) {
    return null;
  }

  const expiresAt = entitlement.expires_date ? new Date(entitlement.expires_date) : null;
  const lifetime = !expiresAt;

  if (expiresAt && expiresAt <= now) {
    return null;
  }

  return {
    entitlementIdentifier,
    productIdentifier: entitlement.product_identifier ?? null,
    expiresAt,
    lifetime
  };
}

async function fetchRevenueCatSubscriber(userId: string) {
  if (!env.REVENUECAT_SECRET_API_KEY) {
    throw new AppError(
      503,
      "RevenueCat backend sync is not configured.",
      "REVENUECAT_SYNC_NOT_CONFIGURED"
    );
  }

  const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.REVENUECAT_SECRET_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new AppError(502, "Unable to sync RevenueCat subscription status.", "REVENUECAT_SYNC_FAILED");
  }

  return (await response.json()) as RevenueCatSubscriberResponse;
}

export async function syncRevenueCatSubscriber(userId: string) {
  const [currentSubscription, subscriber] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    fetchRevenueCatSubscriber(userId)
  ]);
  const activeEntitlement = readRevenueCatEntitlement(subscriber, env.REVENUECAT_ENTITLEMENT_ID);

  if (!activeEntitlement && isPromoPremium(currentSubscription)) {
    return currentSubscription;
  }

  if (!activeEntitlement) {
    return prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: "FREE",
        revenueCatCustomerId: userId,
        entitlementIdentifier: env.REVENUECAT_ENTITLEMENT_ID,
        productIdentifier: null,
        expiresAt: null,
        lifetime: false
      },
      create: {
        userId,
        plan: "FREE",
        revenueCatCustomerId: userId,
        entitlementIdentifier: env.REVENUECAT_ENTITLEMENT_ID,
        productIdentifier: null,
        expiresAt: null,
        lifetime: false
      }
    });
  }

  return prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: "PREMIUM",
      revenueCatCustomerId: userId,
      entitlementIdentifier: activeEntitlement.entitlementIdentifier,
      productIdentifier: activeEntitlement.productIdentifier,
      expiresAt: activeEntitlement.expiresAt,
      lifetime: activeEntitlement.lifetime
    },
    create: {
      userId,
      plan: "PREMIUM",
      revenueCatCustomerId: userId,
      entitlementIdentifier: activeEntitlement.entitlementIdentifier,
      productIdentifier: activeEntitlement.productIdentifier,
      expiresAt: activeEntitlement.expiresAt,
      lifetime: activeEntitlement.lifetime
    }
  });
}

export async function syncRevenueCatWebhook(payload: RevenueCatWebhookEvent) {
  const event = payload.event;

  if (!event?.app_user_id) {
    return null;
  }

  const isActiveEvent = ["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE"].includes(event.type ?? "");
  const isExpirationEvent = ["EXPIRATION", "CANCELLATION", "BILLING_ISSUE"].includes(event.type ?? "");
  const isLifetime = event.product_id?.toLowerCase().includes("lifetime") ?? false;
  const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
  const currentSubscription = await prisma.subscription.findUnique({
    where: { userId: event.app_user_id }
  });

  if (isExpirationEvent && isPromoPremium(currentSubscription)) {
    return currentSubscription;
  }

  return prisma.subscription.upsert({
    where: { userId: event.app_user_id },
    update: {
      plan: isExpirationEvent ? "FREE" : isActiveEvent || isLifetime ? "PREMIUM" : undefined,
      revenueCatCustomerId: event.app_user_id,
      entitlementIdentifier: event.entitlement_id,
      productIdentifier: event.product_id,
      expiresAt,
      lifetime: isLifetime
    },
    create: {
      userId: event.app_user_id,
      plan: isActiveEvent || isLifetime ? "PREMIUM" : "FREE",
      revenueCatCustomerId: event.app_user_id,
      entitlementIdentifier: event.entitlement_id,
      productIdentifier: event.product_id,
      expiresAt,
      lifetime: isLifetime
    }
  });
}
