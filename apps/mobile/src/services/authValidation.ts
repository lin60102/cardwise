/**
 * Client-side form validation for the login/register screen.
 *
 * Goals:
 *  - Surface clear, friendly rules BEFORE the user submits (helper text).
 *  - Allow the screen to decide WHEN to display each message (e.g. only after blur
 *    or after a submit attempt) — this module is purely declarative.
 *  - Return i18n message keys instead of pre-localized strings so the screen can
 *    render them via the LanguageContext.
 *
 * Server still owns final validation; these checks are usability hints.
 */

export type AuthMode = "login" | "register";

export interface FieldValidation {
  valid: boolean;
  /** i18n key resolved at render time. Undefined when valid. */
  messageKey?: string;
}

export interface FormValidationResult {
  valid: boolean;
  email: FieldValidation;
  password: FieldValidation;
  name: FieldValidation;
}

/** Minimum password length enforced ONLY for new registrations. */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Pragmatic email shape check (local@domain.tld). Server-side validation is
 * authoritative — this exists to catch obvious typos before a round-trip.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): FieldValidation {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, messageKey: "auth.validation.email.required" };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { valid: false, messageKey: "auth.validation.email.format" };
  }

  return { valid: true };
}

export function validatePassword(password: string, mode: AuthMode): FieldValidation {
  if (password.length === 0) {
    return { valid: false, messageKey: "auth.validation.password.required" };
  }

  // Min length is only enforced for new accounts. Logins must still accept
  // legacy passwords that may pre-date this rule.
  if (mode === "register" && password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, messageKey: "auth.validation.password.length" };
  }

  return { valid: true };
}

export function validateName(_name: string, _mode: AuthMode): FieldValidation {
  // Name is optional for register and unused for login.
  return { valid: true };
}

export function validateAuthForm(input: {
  email: string;
  password: string;
  name: string;
  mode: AuthMode;
}): FormValidationResult {
  const email = validateEmail(input.email);
  const password = validatePassword(input.password, input.mode);
  const name = validateName(input.name, input.mode);

  return {
    valid: email.valid && password.valid && name.valid,
    email,
    password,
    name
  };
}
