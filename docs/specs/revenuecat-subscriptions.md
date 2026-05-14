# RevenueCat subscriptions

## Goal

CardWise should let signed-in users purchase or restore Premium through RevenueCat monthly and yearly subscription packages, then sync the verified subscription state to the backend so existing Premium gates use the same plan status as promo codes.

## Behavior

- The mobile app initializes RevenueCat with the authenticated CardWise user id as the RevenueCat app user id.
- The paywall fetches the current RevenueCat offering and displays monthly and yearly package prices when available.
- Purchasing a package or restoring purchases reads RevenueCat `CustomerInfo`, then asks the backend to sync the user's RevenueCat subscriber status.
- The backend verifies subscriber status with RevenueCat before updating the local `Subscription` row.
- The `premium` entitlement unlocks `PREMIUM` while active. A missing or expired entitlement keeps the user `FREE`, except existing promo-code Premium grants are preserved.
- Existing promo code redemption, webhooks, and free tier limits remain unchanged.

## Setup

- RevenueCat entitlement id: `premium`.
- Current offering packages: monthly and annual/yearly.
- Backend env: `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_ENTITLEMENT_ID`.
- Mobile env: `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`, `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`.
- Native purchase testing requires an Expo development build; Expo Go cannot load the RevenueCat native module.
