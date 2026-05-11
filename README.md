# CardWise

CardWise is a US-only credit card optimizer MVP. Users add the cards they own, choose a purchase category, and get a ranked recommendation for the best card to use based on rewards, base earn rates, and spending caps.

## Project Structure

```text
cardwise/
  apps/
    api/                 Express + Prisma backend
      prisma/
        schema.prisma
        seed.ts
      src/
        routes/
        services/
        middleware/
        mappers/
    mobile/              Expo React Native app
      src/
        components/
        context/
        navigation/
        screens/
        services/
  packages/
    shared/              Shared categories, types, and recommendation engine
      src/
      tests/
```

## Stack

- React Native with Expo SDK 54 and TypeScript
- Node.js, Express, and TypeScript
- PostgreSQL with Prisma ORM
- Expo SQLite for the on-device credit card catalog cache
- Sign in with Apple via `expo-apple-authentication`
- RevenueCat placeholder via `react-native-purchases`
- AdMob placeholder via `react-native-google-mobile-ads`
- Vitest tests for recommendation logic

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment values:

```bash
cp .env.example .env
```

3. Start PostgreSQL and create a `cardwise` database, then update `DATABASE_URL` in `.env`.

4. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Seed the card database:

```bash
npm run db:seed
```

6. Start the API:

```bash
npm run dev:api
```

7. Start the mobile app:

```bash
npm run dev:mobile
```

## Expo Native Modules

RevenueCat and AdMob use native libraries. Apple Sign In also needs the iOS Sign in with Apple capability in standalone/development builds. Purchase, ad, and production Apple Sign In testing requires a development build:

```bash
npm run ios -w @cardwise/mobile
npm run android -w @cardwise/mobile
```

For a quick native preview without AdMob or purchases, run:

```bash
npm run dev:mobile
```

Then scan the QR code with Expo Go on iOS or Android. The `w` shortcut opens a browser preview, but the codebase is a React Native app and the primary target remains iOS and Android.

Set these environment variables before building:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=
APPLE_CLIENT_ID=com.cardwise.app
EXPO_PUBLIC_ADMOB_USE_TEST_ADS=true
EXPO_PUBLIC_ADMOB_IOS_APP_ID=
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=
EXPO_PUBLIC_ADMOB_IOS_BANNER_AD_UNIT_ID=
EXPO_PUBLIC_ADMOB_ANDROID_BANNER_AD_UNIT_ID=
```

Keep `EXPO_PUBLIC_ADMOB_USE_TEST_ADS=true` while developing. Real ads require setting the native AdMob App IDs and banner ad unit IDs above, then rebuilding the native development build.

For Apple Sign In, `APPLE_CLIENT_ID` should match the iOS bundle identifier configured in `apps/mobile/app.config.js` unless you intentionally use a different Apple Services ID.

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/apple`
- `GET /cards`
- `GET /cards/search?q=chase`
- `GET /cards/:id`
- `GET /user/cards`
- `POST /user/cards`
- `DELETE /user/cards/:id`
- `POST /recommendations/best-card`
- `GET /subscription/status`
- `POST /subscription/webhook/revenuecat`

Authenticated endpoints expect:

```http
Authorization: Bearer <token>
```

## Freemium Rules

Free users:

- Up to 5 wallet cards
- Personal cards only
- Ads enabled
- Basic category recommendations
- Premium-only annual dashboard and custom category features are paywalled

Premium users:

- Unlimited wallet cards
- Optional business card mode
- No ads
- Annual fee and credit optimization
- Custom categories, annual rewards dashboard, and personalized card suggestions

The backend enforces the 5-card free limit and Premium-only business cards in `apps/api/src/services/walletService.ts`.

## Local Card Cache

The mobile app seeds a local SQLite database on startup through `apps/mobile/src/services/localCardCache.ts`.

- Demo mode reads the card catalog from the on-device cache.
- API card list, search, and detail responses are written back to SQLite.
- If the backend or Supabase/PostgreSQL is unavailable, card browsing falls back to the local catalog.
- User accounts, subscriptions, and cross-device wallet sync still require the backend.

## Recommendation Logic

The shared engine lives in `packages/shared/src/recommendationEngine.ts`.

It:

- Compares only cards in the user's wallet
- Matches the selected purchase category to reward categories
- Falls back to base reward rate when no category matches
- Applies spending caps when current spend is supplied
- Uses blended effective rates when a purchase crosses a cap
- Ranks by effective rate, then lower annual fee as a tie-breaker

Run tests:

```bash
npm run test -w @cardwise/shared
```

## Seed Cards

The seed script includes personal and business cards, including:

- Chase Sapphire Preferred
- Chase Sapphire Reserve
- Chase Freedom Unlimited
- Chase Freedom Flex
- Amex Gold
- Amex Platinum
- Blue Cash Preferred
- Capital One Venture X
- Citi Custom Cash
- Discover it Cash Back
- Chase Ink Business Preferred
- Chase Ink Business Cash
- Chase Ink Business Unlimited
- Chase Ink Business Premier
- Amex Blue Business Plus
- Amex Business Gold
- Amex Business Platinum
- Capital One Venture X Business
- Capital One Spark Cash Plus

Reward values are representative MVP data. Validate rates, fees, caps, and credits before production release because issuer terms change.

## Useful Commands

```bash
npm run build
npm run dev:api
npm run dev:mobile
npm run db:migrate
npm run db:seed
npm run test
```
