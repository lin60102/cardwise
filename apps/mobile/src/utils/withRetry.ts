/**
 * Returns true for errors that are safe to retry:
 *   - TypeError       — fetch/network failure (no HTTP response was received)
 *   - AbortError      — request timed out via AbortController; behaves like a network failure
 *   - status >= 500   — server-side error; the request never reached application logic
 *
 * 4xx errors (auth failures, validation, conflicts) are NOT retried because
 * repeating the same request will produce the same rejection.
 *
 * Intentionally duck-types `.status` and `.name` instead of importing ApiError
 * or DOMException to avoid a circular dependency with api.ts and to stay
 * runtime-agnostic (React Native's AbortError shape is not strictly a DOMException).
 */
function hasErrorName(error: unknown, expected: string): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "name" in error &&
    (error as { name: unknown }).name === expected
  );
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (hasErrorName(error, "AbortError")) return true;

  if (error !== null && typeof error === "object" && "status" in error) {
    const { status } = error as { status: unknown };
    return typeof status === "number" && status >= 500;
  }

  return false;
}

export interface WithRetryOptions {
  /**
   * Called once, immediately before the second attempt, when the first attempt
   * fails with a retryable error. Lets the UI surface a "retrying" message
   * (e.g. while a Render Free instance cold-starts). Never called on success or
   * on a non-retryable failure.
   */
  onRetry?: (error: unknown) => void;
  /** Optional pause before the second attempt, useful for cold-starting hosts. */
  retryDelayMs?: number;
}

function delay(ms: number) {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Calls `fn` and, if it throws a retryable error, calls it exactly once more.
 * The second attempt's result or error is returned as-is — no further retries.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: WithRetryOptions = {}): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isRetryableError(error)) {
      options.onRetry?.(error);
      await delay(options.retryDelayMs ?? 0);
      return fn();
    }
    throw error;
  }
}
