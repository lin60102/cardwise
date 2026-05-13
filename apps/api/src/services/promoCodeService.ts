import { prisma } from "../db.js";
import { getEffectivePlan } from "./subscriptionService.js";
import { AppError } from "../utils/errors.js";

export interface PromoCodeGrant {
  code: string;
  lifetime: boolean;
  durationDays?: number;
}

function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

export function parsePromoCodeConfig(config: string | undefined) {
  if (!config?.trim()) {
    return [];
  }

  return config
    .split(",")
    .map((entry): PromoCodeGrant | null => {
      const [rawCode, rawGrant] = entry.split(":").map((part) => part.trim());
      if (!rawCode || !rawGrant) {
        return null;
      }

      if (rawGrant.toLowerCase() === "lifetime") {
        return {
          code: normalizePromoCode(rawCode),
          lifetime: true
        };
      }

      const durationDays = Number(rawGrant);
      if (!Number.isInteger(durationDays) || durationDays <= 0) {
        return null;
      }

      return {
        code: normalizePromoCode(rawCode),
        lifetime: false,
        durationDays
      };
    })
    .filter((grant): grant is PromoCodeGrant => Boolean(grant));
}

export function findPromoCodeGrant(config: string | undefined, inputCode: string) {
  const normalizedInput = normalizePromoCode(inputCode);
  return parsePromoCodeConfig(config).find((grant) => grant.code === normalizedInput) ?? null;
}

export async function redeemPromoCode(userId: string, inputCode: string, config: string | undefined, now = new Date()) {
  if (!inputCode.trim()) {
    throw new AppError(400, "Enter a promo code.", "PROMO_CODE_REQUIRED");
  }

  const grant = findPromoCodeGrant(config, inputCode);
  if (!grant) {
    throw new AppError(404, "Promo code is invalid or expired.", "INVALID_PROMO_CODE");
  }

  const expiresAt = grant.lifetime ? null : new Date(now.getTime() + (grant.durationDays ?? 0) * 24 * 60 * 60 * 1000);
  const existingSubscription = await prisma.subscription.findUnique({ where: { userId } });

  if (existingSubscription?.lifetime && getEffectivePlan(existingSubscription, now) === "PREMIUM" && !grant.lifetime) {
    return existingSubscription;
  }

  return prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: "PREMIUM",
      entitlementIdentifier: "promo",
      productIdentifier: `promo:${grant.code}`,
      expiresAt,
      lifetime: grant.lifetime
    },
    create: {
      userId,
      plan: "PREMIUM",
      entitlementIdentifier: "promo",
      productIdentifier: `promo:${grant.code}`,
      expiresAt,
      lifetime: grant.lifetime
    }
  });
}
