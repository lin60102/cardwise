# Spec: Promo Code Redemption

## Objective
Signed-in CardWise users can enter an owner-configured promo code from the app and receive Premium access without going through RevenueCat checkout.

## Commands
- API tests: `npm run test -w @cardwise/api`
- Mobile tests: `npm run test -w @cardwise/mobile`
- Lint: `npm run lint`
- Build: `npm run build`

## Project Structure
- API validation and redemption live in `apps/api/src/services` and `apps/api/src/routes/subscription.ts`.
- Mobile API wiring lives in `apps/mobile/src/services/api.ts`.
- Settings UI owns the promo code entry form.
- Translation copy lives in `apps/mobile/src/i18n/translations.ts`.

## Behavior
- Promo codes are configured by the server with `PROMO_CODES`.
- Format: comma-separated `CODE:lifetime` or `CODE:<days>`, for example `CARDWISEVIP:lifetime,TRIAL30:30`.
- Codes are case-insensitive and trimmed.
- A valid code upserts the user's subscription to `PREMIUM`.
- Lifetime codes set `lifetime=true` and no expiration.
- Day-based codes set `expiresAt` to now plus the configured number of days.
- Invalid or missing codes return a safe API error.

## Boundaries
- Always: validate on the backend, avoid hard-coding secret promo codes in mobile code, keep raw server details out of user messages.
- Ask first: database schema changes, admin UI, promo usage limits.
- Never: grant Premium from frontend-only checks.

## Success Criteria
- `POST /subscription/promo-code` validates authenticated requests and grants Premium for valid codes.
- Settings screen includes a promo code input with loading, error, and success states.
- User plan refreshes immediately after successful redemption.
- API promo code parsing has unit tests.
- Existing lint, tests, and build pass.
