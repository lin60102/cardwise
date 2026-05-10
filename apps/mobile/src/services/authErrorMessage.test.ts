import { describe, expect, it } from "vitest";
import { getAuthErrorMessageKey } from "./authErrorMessage";

describe("getAuthErrorMessageKey", () => {
  it("maps invalid login credentials to a safe message key", () => {
    const error = { status: 401, code: "INVALID_CREDENTIALS", message: "password hash mismatch" };

    expect(getAuthErrorMessageKey(error, "login")).toBe("auth.error.invalidCredentials");
  });

  it("maps duplicate registration email errors to an existing account message key", () => {
    const error = { status: 409, code: "EMAIL_ALREADY_EXISTS", message: "Unique constraint failed on User.email" };

    expect(getAuthErrorMessageKey(error, "register")).toBe("auth.error.emailExists");
  });

  it("maps validation errors to an input correction message key", () => {
    const error = { status: 400, code: "VALIDATION_ERROR", message: "Invalid payload" };

    expect(getAuthErrorMessageKey(error, "register")).toBe("auth.error.invalidInput");
  });

  it("maps fetch and network failures to a connectivity message key", () => {
    const error = new TypeError("Network request failed");

    expect(getAuthErrorMessageKey(error, "login")).toBe("auth.error.network");
  });

  it("maps server errors to a temporary service issue message key", () => {
    const error = { status: 503, code: "SERVICE_UNAVAILABLE", message: "database connection refused" };

    expect(getAuthErrorMessageKey(error, "login")).toBe("auth.error.server");
  });

  it("uses context-specific fallback keys for unknown auth failures", () => {
    expect(getAuthErrorMessageKey(new Error("unexpected"), "login")).toBe("auth.error.loginGeneric");
    expect(getAuthErrorMessageKey(new Error("unexpected"), "register")).toBe("auth.error.registerGeneric");
    expect(getAuthErrorMessageKey(new Error("unexpected"), "demo")).toBe("auth.error.demoGeneric");
  });
});
