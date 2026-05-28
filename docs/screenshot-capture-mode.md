# CardWise Screenshot Capture Mode

Screenshot mode creates a deterministic, polished app state for App Store screenshots.

## Enable

Set these environment variables before starting the Expo app:

```bash
EXPO_PUBLIC_SCREENSHOT_MODE=true
EXPO_PUBLIC_SCREENSHOT_START=wallet
EXPO_PUBLIC_ENABLE_NATIVE_ADS=false
EXPO_PUBLIC_ADMOB_DEBUG=false
```

Valid `EXPO_PUBLIC_SCREENSHOT_START` values:

- `onboarding`
- `wallet`
- `recommendation`
- `annualDashboard`
- `paywall`

Example:

```bash
npm run dev:mobile -- --tunnel --clear
```

## What Screenshot Mode Does

- Uses a deterministic Premium demo user.
- Uses a curated wallet with personal and business cards.
- Shows a precomputed Groceries recommendation.
- Shows realistic annual fee and credit values.
- Skips auth, backend calls, loading spinners, AdMob placeholders, RevenueCat loading states, and unstable debug UI.
- Forces English and light mode for consistent screenshots.

## Recommended Screenshots

1. Onboarding: `EXPO_PUBLIC_SCREENSHOT_START=onboarding`
2. Wallet: `EXPO_PUBLIC_SCREENSHOT_START=wallet`
3. Recommendation: `EXPO_PUBLIC_SCREENSHOT_START=recommendation`
4. Annual dashboard: `EXPO_PUBLIC_SCREENSHOT_START=annualDashboard`
5. Paywall: `EXPO_PUBLIC_SCREENSHOT_START=paywall`

## Notes

- Screenshot mode is controlled only by public Expo environment variables and should not be enabled for production builds.
- The mode does not modify recommendation engine logic.
- The UI still uses real CardWise screens and components; only the data source is deterministic.
