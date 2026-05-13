import { describe, expect, it } from "vitest";
import { getEffectivePlan } from "./subscriptionService.js";
import { findPromoCodeGrant, parsePromoCodeConfig } from "./promoCodeService.js";

describe("parsePromoCodeConfig", () => {
  it("parses lifetime and day-based promo code grants", () => {
    expect(parsePromoCodeConfig("CARDWISEVIP:lifetime,TRIAL30:30")).toEqual([
      { code: "CARDWISEVIP", lifetime: true },
      { code: "TRIAL30", lifetime: false, durationDays: 30 }
    ]);
  });

  it("ignores malformed promo code entries", () => {
    expect(parsePromoCodeConfig("GOOD:14,bad,nope:zero,FREE:0")).toEqual([
      { code: "GOOD", lifetime: false, durationDays: 14 }
    ]);
  });
});

describe("findPromoCodeGrant", () => {
  it("matches codes case-insensitively after trimming", () => {
    expect(findPromoCodeGrant("CardWiseVip:lifetime", " cardwisevip ")).toEqual({
      code: "CARDWISEVIP",
      lifetime: true
    });
  });

  it("returns null when no configured code matches", () => {
    expect(findPromoCodeGrant("CARDWISEVIP:lifetime", "missing")).toBeNull();
  });
});

describe("getEffectivePlan", () => {
  it("keeps lifetime Premium active without an expiration", () => {
    expect(getEffectivePlan({ plan: "PREMIUM", lifetime: true, expiresAt: null })).toBe("PREMIUM");
  });

  it("treats expired non-lifetime Premium as Free", () => {
    expect(getEffectivePlan({ plan: "PREMIUM", lifetime: false, expiresAt: new Date("2026-01-01") }, new Date("2026-01-02"))).toBe("FREE");
  });
});
