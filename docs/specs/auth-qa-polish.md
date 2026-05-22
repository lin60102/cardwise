# Auth QA polish

## Goal

Improve the login/register experience without requiring a new native iOS build.

## Behavior

- Register mode always explains the password rule before submission.
- Login/register submit buttons are disabled while invalid or loading.
- When disabled by validation, the screen shows the first actionable reason.
- Loading state prevents duplicate login/register/demo/Apple submissions.
- Login/register retry only transient network, timeout, or 5xx failures once, after a short cold-start delay.
- Apple Sign In, validation failures, invalid credentials, and duplicate email errors are not retried.
- 400, 401, 409, and other validation/auth errors are not retried.
- Stored authenticated sessions are validated before authenticated tabs render.
- Invalid or orphaned stored tokens are cleared and route back to login/register.
- Wallet, recommendation, and paywall keep their existing loading, empty, error, and fallback states.

## Out of Scope

- No recommendation engine changes.
- No Prisma schema changes.
- No EAS iOS builds while the Expo free plan quota is exhausted.
