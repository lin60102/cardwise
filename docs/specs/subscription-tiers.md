# Subscription Tiers

## Goal

Move CardWise from a single `FREE` / `PREMIUM` model to clear subscription tiers that are easy for non-technical users to compare, enforce consistently across mobile and API, and map cleanly to RevenueCat, App Store, and Google Play products.

No source implementation is included in this spec. This document defines the product behavior and implementation plan only.

## Current State

- `PlanStatus` currently supports `FREE` and `PREMIUM`.
- The API stores one `Subscription` row per user with RevenueCat identifiers and a single `plan`.
- Mobile paywall hardcodes `monthly`, `yearly`, and `lifetime` options.
- RevenueCat purchase and restore flows are placeholders.
- Free plan rules already exist: five wallet cards, personal cards only, ads, basic recommendations.
- Premium-only areas already exist conceptually: no ads, unlimited cards, business cards, annual dashboard, custom/category spend tracking, capped reward tracking.

## External Platform Rules

- Apple recommends a single subscription group for apps where users expect one active subscription, and ranks subscription levels from most access to least access. Upgrades take effect immediately; downgrades take effect at next renewal.
- Google Play models subscriptions as subscriptions with base plans and offers. Different tiers can represent different benefits; base plans represent billing periods and renewal type.
- RevenueCat products are what users buy, entitlements are what the app unlocks, and offerings/packages are what the paywall displays.
- RevenueCat purchase responses and `getCustomerInfo()` should be used to decide entitlement access; restore purchases must be available.

Sources:
- Apple: https://developer.apple.com/app-store/subscriptions/
- Google Play: https://support.google.com/googleplay/android-developer/answer/12154973
- RevenueCat entitlements: https://www.revenuecat.com/docs/getting-started/entitlements
- RevenueCat offerings: https://www.revenuecat.com/docs/offerings/overview
- RevenueCat purchases: https://www.revenuecat.com/docs/getting-started/making-purchases

## Proposed Tiers

### Free

Audience: users trying CardWise casually.

Access:
- Five personal wallet cards.
- Basic best-card recommendations by category.
- Local card catalog fallback and demo mode.
- Ads enabled.
- No business cards.
- No spend cap progress tracking.
- No annual optimization dashboard.

### Plus

Audience: everyday personal card users who want ad-free optimization.

Access:
- Unlimited personal wallet cards.
- No ads.
- Basic and cap-aware recommendations.
- Spend profile.
- Bonus tracker.
- Annual value dashboard for personal cards.
- Purchase history/spend tracking if the bookkeeping feature is enabled later.
- No business cards or business spend optimization.

### Pro

Audience: heavy optimizers, small business users, and users managing personal plus business rewards.

Access:
- Everything in Plus.
- Business cards.
- Business card mode and business spend optimization.
- Custom categories.
- Advanced annual rewards dashboard.
- Personalized card suggestions.
- Exportable spend/reward history when bookkeeping exists.
- Priority support messaging can be offered later, but should not be promised until there is an operational support process.

## Tier Hierarchy

Use hierarchy, not scattered string comparisons:

- `FREE = 0`
- `PLUS = 1`
- `PRO = 2`

Feature gates should ask capability questions, for example:

- `canUseUnlimitedPersonalCards`
- `canHideAds`
- `canUseSpendProfile`
- `canUseAnnualDashboard`
- `canUseBusinessCards`
- `canUseCustomCategories`
- `canUseAdvancedRecommendations`

This keeps future tiers from requiring widespread UI/backend rewrites.

## RevenueCat Configuration

Recommended entitlements:

- `plus`: unlocks Plus access.
- `pro`: unlocks Pro access.

Pro should also unlock Plus-level features in app logic. Either attach Pro products to both entitlements in RevenueCat, or treat `pro` as higher rank than `plus` in CardWise entitlement mapping. Prefer explicit app-side hierarchy so the backend remains the source of truth.

Recommended offering:

- Offering identifier: `default`
- Packages:
  - `plus_monthly`
  - `plus_yearly`
  - `pro_monthly`
  - `pro_yearly`

Optional later:

- `pro_lifetime` as a non-consumable product, not an auto-renewable subscription.
- One-time sponsorship products should remain separate from subscription entitlements.

Example product identifiers:

- iOS:
  - `cardwise_plus_monthly`
  - `cardwise_plus_yearly`
  - `cardwise_pro_monthly`
  - `cardwise_pro_yearly`
- Android:
  - Subscription `cardwise_plus` with monthly/yearly base plans.
  - Subscription `cardwise_pro` with monthly/yearly base plans.

Do not hardcode display prices in app UI. Show localized price strings from RevenueCat/store product metadata.

## API Behavior

### Subscription Status

`GET /subscription/status` should return:

- Current tier: `FREE`, `PLUS`, or `PRO`.
- Active entitlements.
- Product identifier.
- Store/source if available.
- Expiration date if applicable.
- Whether the access is lifetime/non-renewing.
- Any billing issue or grace-period state if RevenueCat exposes it in webhook/customer info.

### Webhook Sync

RevenueCat webhooks should map entitlement IDs and product IDs to CardWise tier state:

- Active `pro` entitlement -> `PRO`.
- Active `plus` entitlement -> `PLUS`.
- No active paid entitlement -> `FREE`.
- Expiration, cancellation after access end, billing issue without grace access -> downgrade to `FREE`.

If both Plus and Pro are active, Pro wins.

### Backend Enforcement

The backend must enforce all tier limits regardless of what the mobile UI shows:

- Wallet card count.
- Business card access.
- Annual dashboard access.
- Future custom categories and bookkeeping access.

Mobile should only mirror server decisions for UX.

## Mobile UX Behavior

### Paywall

The paywall should become a tier comparison view:

- Top section: short value proposition.
- Tier cards for Plus and Pro.
- Billing period toggle: monthly/yearly.
- Clear feature comparison.
- Store-localized price per selected package.
- Primary CTA names the selected tier and billing period.
- Restore purchases action visible.
- "Maybe later" remains available unless a specific flow requires blocking access.

### Upgrade/Downgrade

- Free users see Plus as the recommended default unless they attempted a Pro-only action.
- Attempting a business-card or business-optimization action routes users directly to Pro messaging.
- Existing Plus users see Pro upgrade messaging on Pro-only gates.
- Existing Pro users should not see upgrade CTAs.

### Settings

Settings should show:

- Current tier badge.
- Renewal/source details when available.
- Refresh subscription status.
- Restore purchases.
- Manage subscription guidance.

## Migration

Existing `PREMIUM` users should become `PRO` by default to avoid taking away already-promised access.

Migration rule:

- `FREE -> FREE`
- `PREMIUM -> PRO`

If the team wants a softer launch, use a temporary grandfather flag later, but defaulting `PREMIUM` to `PRO` is the safest user-trust decision.

## Implementation Plan

### Phase 1: Contract and Migration

Task 1: Define tier contract.

Acceptance criteria:
- Shared type supports `FREE`, `PLUS`, `PRO`.
- Feature gates are represented in one helper/module.
- Existing `PREMIUM` references have a planned mapping.

Likely files:
- `packages/shared/src`
- `apps/api/prisma/schema.prisma`
- `apps/api/src`
- `apps/mobile/src`

Task 2: Add database migration.

Acceptance criteria:
- Existing users keep equivalent or better access.
- `PREMIUM` data migrates to `PRO`.
- Prisma client generates successfully.

Verification:
- `npm run db:generate`
- `npm run build -w @cardwise/api`

### Phase 2: API Enforcement

Task 3: Update subscription status endpoint.

Acceptance criteria:
- Status returns tier plus entitlement details.
- Existing clients can still safely read current plan during transition.
- Empty/missing subscription returns Free.

Verification:
- API build passes.
- Focused API tests or service tests cover Free, Plus, Pro.

Task 4: Centralize tier gates in API services.

Acceptance criteria:
- Wallet limits and business card access use shared tier gates.
- Pro-only API paths reject lower tiers with stable error codes.
- Error codes can drive paywall routing.

Verification:
- Tests cover Free card limit, Plus unlimited personal cards, Pro business cards.

### Phase 3: RevenueCat Integration

Task 5: Replace purchase placeholder with offerings/packages.

Acceptance criteria:
- Mobile fetches `offerings.current`.
- Packages are matched by metadata/package identifiers, not hardcoded prices.
- Purchase calls `purchasePackage`.
- Successful purchases update local user tier and backend subscription status.

Verification:
- Native development build purchase flow with RevenueCat Test Store or sandbox.

Task 6: Add restore purchases.

Acceptance criteria:
- Settings and paywall expose restore.
- Restore calls RevenueCat and refreshes backend/user state.
- User cancellation and no-purchase states show understandable messages.

Verification:
- Restore flow tested in native development build.

Task 7: Harden webhook processing.

Acceptance criteria:
- RevenueCat webhook uses raw-body signature verification.
- Webhook maps entitlement IDs to tiers.
- Product changes, renewals, cancellations, expirations, and billing issues are handled deterministically.

Verification:
- Service tests cover representative RevenueCat event payloads.
- API build passes.

### Phase 4: Mobile Tier UX

Task 8: Redesign paywall for tier comparison.

Acceptance criteria:
- Plus and Pro are visually distinct and easy to compare.
- Free users default to Plus unless entering from a Pro-only gate.
- Prices come from store metadata.
- Loading, empty offering, purchase error, and purchase success states are clear.

Verification:
- Mobile typecheck.
- Browser/mobile visual check where available.
- Native build check for RevenueCat package loading.

Task 9: Update feature gates and navigation.

Acceptance criteria:
- Ads hide for Plus and Pro.
- Business card controls require Pro.
- Spend, bonus, annual dashboard, and cap-aware features match tier rules.
- Paywall reasons name the tier needed.

Verification:
- Manual flows for Free, Plus, Pro users.
- Pure gate tests in mobile/shared if extracted.

### Phase 5: Launch Readiness

Task 10: Store dashboard setup.

Acceptance criteria:
- App Store subscription group has Pro ranked above Plus.
- Monthly/yearly products exist for both tiers.
- Google Play subscriptions/base plans exist for Plus and Pro.
- RevenueCat products, entitlements, offerings, and packages are connected.

Verification:
- RevenueCat dashboard shows products available.
- Sandbox/Test Store purchases unlock expected entitlement.

Task 11: Documentation and support.

Acceptance criteria:
- README documents tier rules and required product identifiers.
- Settings explains restore/manage subscription.
- Internal test checklist exists for purchase, restore, upgrade, downgrade, expiration.

Verification:
- `npm run build`
- `npm run lint`
- Native smoke test on iOS and Android development builds.

## Open Questions

- Final pricing: suggested placeholder is Plus monthly/yearly and Pro monthly/yearly, but store-localized prices should drive UI.
- Should existing Premium users be grandfathered as Pro forever, or only mapped to Pro until their subscription renews?
- Should Plus include annual dashboard, or should that remain Pro-only?
- Should bookkeeping/spend history be included in Plus, Pro, or introduced as a later add-on?
- Should lifetime access remain available, and if so, should it unlock Pro only?

