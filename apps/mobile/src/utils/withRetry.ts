/**
 * Returns true for errors that are safe to retry:
 *   - TypeError  — fetch/network failure (no HTTP response was received)
 *   - status >= 500 — server-side error; the request never reached application logic
 *
 * 4xx errors (auth failures, validation, conflicts) are NOT retried because
 * repeating the same request will produce the same rejection.
 *
 * Intentionally duck-types `.status` instead of importing ApiError to avoid a
 * circular dependency with api.ts.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) return true;

  if (error !== null && typeof error === "object" && "status" in error) {
    const { status } = error as { status: unknown };
    return typeof status === "number" && status >= 500;
  }

  return false;
}

/**
 * Calls `fn` and, if it throws a retryable error, calls it exactly once more.
 * The second attempt's result or error is returned as-is — no further retries.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isRetryableError(error)) {
      return fn();
    }
    throw error;
  }
}
