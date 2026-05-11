# Auth Token Refresh

## Goal

Keep the API auth token used by mobile requests in sync when persisted auth storage is refreshed, rotated, or cleared.

## Behavior

- Before auth context hydration, API requests may read the persisted auth token.
- After login, the in-memory token is authoritative so immediate API requests do not use stale persisted data.
- After logout, a null in-memory token is authoritative so stale persisted data is not reused.
- When the app explicitly refreshes auth token state from storage, the in-memory token updates to the latest stored value.
- If refreshed storage has no token, the in-memory token clears and future API calls stay unauthenticated until a new login.

## Verification

- `apps/mobile/src/services/authTokenState.test.ts` covers fallback, login, logout, token rotation, and cleared-token refresh behavior.
