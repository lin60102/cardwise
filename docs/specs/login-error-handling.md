# Spec: Login Error Handling

## Objective
CardWise should show safe, localized, user-friendly messages when login, registration, or demo sign-in fails. Users should not see raw backend, network, or JavaScript exception text on the login/register screen.

## Tech Stack
- React Native with Expo SDK 54
- TypeScript
- Vitest for small, pure unit tests
- Existing CardWise translation map for English, Chinese, Spanish, and Japanese

## Commands
- Mobile tests: `npm run test -w @cardwise/mobile`
- Mobile typecheck: `npm run typecheck -w @cardwise/mobile`
- Full build: `npm run build`
- Mobile dev server: `npm run dev:mobile -- --tunnel --clear`

## Project Structure
- `apps/mobile/src/screens` contains React Native screens.
- `apps/mobile/src/services` contains app-side business logic and API helpers.
- `apps/mobile/src/i18n` contains translation keys and language metadata.
- `apps/mobile/src/**/*.test.ts` contains mobile unit tests.

## Code Style
```ts
export function getAuthErrorMessageKey(error: unknown, context: AuthErrorContext) {
  if (isApiErrorLike(error) && error.status === 401) {
    return "auth.error.invalidCredentials";
  }

  return context === "register" ? "auth.error.registerGeneric" : "auth.error.loginGeneric";
}
```

- Keep error classification outside React components.
- Return translation keys instead of hard-coded UI strings from business logic.
- Prefer small pure functions that can be tested without Expo or React Native runtime.

## Testing Strategy
- Add small Vitest unit tests for auth error classification.
- Cover invalid credentials, duplicate registration email, validation failures, network failures, server failures, and generic fallback behavior.
- Avoid component tests for this change because the behavior can be proven through pure mapping logic and typechecking.

## Boundaries
- Always: keep login/register UI localized, run mobile tests and typecheck before shipping, keep raw error text out of the auth screen.
- Ask first: changing backend auth response shape, adding a new UI test framework, changing navigation behavior.
- Never: expose stack traces or backend exception text to users, commit secrets, remove existing fallback demo behavior.

## Success Criteria
- Login 401 or `INVALID_CREDENTIALS` maps to a friendly invalid email/password message.
- Registration 409 or duplicate-email code maps to a friendly existing-account message.
- Validation errors map to a concise input correction message.
- Network/fetch failures map to a connectivity message.
- 5xx failures map to a temporary service issue message.
- Unknown failures map to context-specific generic auth messages.
- Messages are available in English, Chinese, Spanish, and Japanese.
- `LoginRegisterScreen` uses the mapper instead of rendering raw exception messages.
- `npm run test -w @cardwise/mobile` and `npm run typecheck -w @cardwise/mobile` pass.

## Open Questions
- None for this slice. Backend auth behavior remains unchanged.
