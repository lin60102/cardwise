import { prisma } from "../db.js";

interface RevenueCatWebhookEvent {
  event?: {
    app_user_id?: string;
    type?: string;
    product_id?: string;
    entitlement_id?: string;
    expiration_at_ms?: number | null;
  };
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

