import { afterEach, describe, expect, it, vi } from "vitest";
import { getApiAuthToken, resetApiAuthTokenForTests, setApiAuthToken } from "./authTokenState";

describe("auth token state", () => {
  afterEach(() => {
    resetApiAuthTokenForTests();
  });

  it("falls back to the stored token before the auth context hydrates", async () => {
    const readStoredToken = vi.fn().mockResolvedValue("stored-token");

    await expect(getApiAuthToken(readStoredToken)).resolves.toBe("stored-token");
    expect(readStoredToken).toHaveBeenCalledTimes(1);
  });

  it("uses the in-memory token immediately after login", async () => {
    const readStoredToken = vi.fn().mockResolvedValue("stale-token");

    setApiAuthToken("fresh-login-token");

    await expect(getApiAuthToken(readStoredToken)).resolves.toBe("fresh-login-token");
    expect(readStoredToken).not.toHaveBeenCalled();
  });

  it("does not use a stale stored token after logout", async () => {
    const readStoredToken = vi.fn().mockResolvedValue("stale-token");

    setApiAuthToken(null);

    await expect(getApiAuthToken(readStoredToken)).resolves.toBeNull();
    expect(readStoredToken).not.toHaveBeenCalled();
  });
});

