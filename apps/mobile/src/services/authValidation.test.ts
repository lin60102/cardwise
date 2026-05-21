import { describe, expect, it } from "vitest";
import {
  PASSWORD_MIN_LENGTH,
  validateAuthForm,
  validateEmail,
  validateName,
  validatePassword
} from "./authValidation";

describe("validateEmail", () => {
  it("flags empty input as required", () => {
    expect(validateEmail("")).toEqual({ valid: false, messageKey: "auth.validation.email.required" });
  });

  it("flags whitespace-only input as required", () => {
    expect(validateEmail("   ")).toEqual({ valid: false, messageKey: "auth.validation.email.required" });
  });

  it("flags malformed addresses as bad format", () => {
    expect(validateEmail("not-an-email").messageKey).toBe("auth.validation.email.format");
    expect(validateEmail("missing@tld").messageKey).toBe("auth.validation.email.format");
    expect(validateEmail("@missing-local.com").messageKey).toBe("auth.validation.email.format");
    expect(validateEmail("spaces in@address.com").messageKey).toBe("auth.validation.email.format");
  });

  it("accepts a well-formed address", () => {
    expect(validateEmail("user@cardwise.app")).toEqual({ valid: true });
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validateEmail("  user@cardwise.app  ")).toEqual({ valid: true });
  });
});

describe("validatePassword", () => {
  it("flags empty input as required for both modes", () => {
    expect(validatePassword("", "login").messageKey).toBe("auth.validation.password.required");
    expect(validatePassword("", "register").messageKey).toBe("auth.validation.password.required");
  });

  it("accepts short passwords on login (legacy accounts)", () => {
    expect(validatePassword("short", "login")).toEqual({ valid: true });
  });

  it("enforces the minimum length on register", () => {
    expect(validatePassword("short", "register")).toEqual({
      valid: false,
      messageKey: "auth.validation.password.length"
    });
  });

  it("accepts a password that meets the minimum on register", () => {
    expect(validatePassword("a".repeat(PASSWORD_MIN_LENGTH), "register")).toEqual({ valid: true });
  });

  it("accepts a password longer than the minimum on register", () => {
    expect(validatePassword("a".repeat(PASSWORD_MIN_LENGTH + 4), "register")).toEqual({ valid: true });
  });
});

describe("validateName", () => {
  it("accepts any name including empty (field is optional)", () => {
    expect(validateName("", "register")).toEqual({ valid: true });
    expect(validateName("Alice", "register")).toEqual({ valid: true });
    expect(validateName("", "login")).toEqual({ valid: true });
  });
});

describe("validateAuthForm", () => {
  it("returns valid for a well-formed login form even with a short password", () => {
    const result = validateAuthForm({ email: "user@x.io", password: "short", name: "", mode: "login" });
    expect(result.valid).toBe(true);
    expect(result.email.valid).toBe(true);
    expect(result.password.valid).toBe(true);
  });

  it("rejects a register form with a too-short password", () => {
    const result = validateAuthForm({ email: "user@x.io", password: "short", name: "", mode: "register" });
    expect(result.valid).toBe(false);
    expect(result.email.valid).toBe(true);
    expect(result.password.messageKey).toBe("auth.validation.password.length");
  });

  it("reports each invalid field independently", () => {
    const result = validateAuthForm({ email: "bad", password: "", name: "", mode: "register" });
    expect(result.valid).toBe(false);
    expect(result.email.messageKey).toBe("auth.validation.email.format");
    expect(result.password.messageKey).toBe("auth.validation.password.required");
    expect(result.name.valid).toBe(true);
  });

  it("returns a fully valid register form", () => {
    const result = validateAuthForm({
      email: "user@cardwise.app",
      password: "a".repeat(PASSWORD_MIN_LENGTH),
      name: "Alice",
      mode: "register"
    });
    expect(result.valid).toBe(true);
  });
});
