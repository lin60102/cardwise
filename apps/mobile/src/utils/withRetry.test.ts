import { describe, expect, it, vi } from "vitest";
import { isRetryableError, withRetry } from "./withRetry";

/** Minimal stand-in for ApiError — only carries .status so we don't import api.ts. */
class StubApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** AbortError stand-in. RN's abort error has `name === "AbortError"`. */
function makeAbortError() {
  const err = new Error("The operation was aborted.");
  err.name = "AbortError";
  return err;
}

describe("isRetryableError", () => {
  it("treats a TypeError as retryable (network / fetch failure)", () => {
    expect(isRetryableError(new TypeError("Network request failed"))).toBe(true);
  });

  it("treats an AbortError as retryable (request timeout)", () => {
    expect(isRetryableError(makeAbortError())).toBe(true);
  });

  it("treats a 500 status as retryable", () => {
    expect(isRetryableError(new StubApiError("Internal Server Error", 500))).toBe(true);
  });

  it("treats a 503 status as retryable", () => {
    expect(isRetryableError(new StubApiError("Service Unavailable", 503))).toBe(true);
  });

  it("treats 502 and 504 statuses as retryable gateway failures", () => {
    expect(isRetryableError(new StubApiError("Bad Gateway", 502))).toBe(true);
    expect(isRetryableError(new StubApiError("Gateway Timeout", 504))).toBe(true);
  });

  it("does not treat a 400 status as retryable", () => {
    expect(isRetryableError(new StubApiError("Bad Request", 400))).toBe(false);
  });

  it("does not treat a 401 status as retryable", () => {
    expect(isRetryableError(new StubApiError("Unauthorized", 401))).toBe(false);
  });

  it("does not treat a 409 status as retryable", () => {
    expect(isRetryableError(new StubApiError("Conflict", 409))).toBe(false);
  });

  it("does not treat a plain Error as retryable", () => {
    expect(isRetryableError(new Error("something unexpected"))).toBe(false);
  });

  it("does not treat a non-object as retryable", () => {
    expect(isRetryableError("oops")).toBe(false);
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});

describe("withRetry", () => {
  it("returns the result immediately when the first attempt succeeds", async () => {
    const fn = vi.fn().mockResolvedValue("ok");

    await expect(withRetry(fn)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries once and resolves when the first attempt fails with a TypeError", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Network request failed"))
      .mockResolvedValue("recovered");

    await expect(withRetry(fn)).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("retries once and resolves when the first attempt aborts (timeout)", async () => {
    const fn = vi.fn().mockRejectedValueOnce(makeAbortError()).mockResolvedValue("recovered");

    await expect(withRetry(fn)).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("retries once and resolves when the first attempt fails with a 5xx error", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new StubApiError("Service Unavailable", 503))
      .mockResolvedValue("recovered");

    await expect(withRetry(fn)).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("re-throws on the second attempt if both fail", async () => {
    const second = new TypeError("still down");
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Network request failed"))
      .mockRejectedValueOnce(second);

    await expect(withRetry(fn)).rejects.toBe(second);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 401 error and throws immediately", async () => {
    const error = new StubApiError("Unauthorized", 401);
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry a 400 validation error and throws immediately", async () => {
    const error = new StubApiError("Bad Request", 400);
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry a 409 conflict error and throws immediately", async () => {
    const error = new StubApiError("Conflict", 409);
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry a plain Error and throws immediately", async () => {
    const error = new Error("unexpected");
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry exactly once before the second attempt when retrying", async () => {
    const retryError = new TypeError("Network request failed");
    const fn = vi.fn().mockRejectedValueOnce(retryError).mockResolvedValue("recovered");
    const onRetry = vi.fn();

    await expect(withRetry(fn, { onRetry })).resolves.toBe("recovered");
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(retryError);
  });

  it("waits for the configured retry delay before the second attempt", async () => {
    vi.useFakeTimers();
    try {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new StubApiError("Service Unavailable", 503))
        .mockResolvedValue("recovered");
      const onRetry = vi.fn();

      const result = withRetry(fn, { onRetry, retryDelayMs: 1500 });

      await vi.advanceTimersByTimeAsync(0);
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1499);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toBe("recovered");
      expect(fn).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not call onRetry when the first attempt succeeds", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const onRetry = vi.fn();

    await expect(withRetry(fn, { onRetry })).resolves.toBe("ok");
    expect(onRetry).not.toHaveBeenCalled();
  });

  it("does not call onRetry for a non-retryable error", async () => {
    const fn = vi.fn().mockRejectedValue(new StubApiError("Unauthorized", 401));
    const onRetry = vi.fn();

    await expect(withRetry(fn, { onRetry })).rejects.toBeInstanceOf(StubApiError);
    expect(onRetry).not.toHaveBeenCalled();
  });
});
