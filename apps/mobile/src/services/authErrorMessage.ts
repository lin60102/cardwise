export type AuthErrorContext = "login" | "register" | "demo";

type ApiErrorLike = {
  status?: number;
  code?: string;
  message?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorShape(error: unknown): ApiErrorLike {
  if (!isRecord(error)) {
    return {};
  }

  return {
    status: typeof error.status === "number" ? error.status : undefined,
    code: typeof error.code === "string" ? error.code : undefined,
    message: typeof error.message === "string" ? error.message : undefined
  };
}

function isNetworkFailure(error: unknown, message?: string) {
  if (error instanceof TypeError) {
    return true;
  }

  return Boolean(message?.match(/network|fetch|internet|connection|offline/i));
}

export function getAuthErrorMessageKey(error: unknown, context: AuthErrorContext) {
  const { status, code, message } = getErrorShape(error);
  const normalizedCode = code?.toUpperCase();

  if (status === 401 || normalizedCode === "INVALID_CREDENTIALS") {
    return "auth.error.invalidCredentials";
  }

  if (status === 409 || normalizedCode === "EMAIL_ALREADY_EXISTS" || normalizedCode === "USER_ALREADY_EXISTS") {
    return "auth.error.emailExists";
  }

  if (status === 400 || status === 422 || normalizedCode === "VALIDATION_ERROR") {
    return "auth.error.invalidInput";
  }

  if (typeof status === "number" && status >= 500) {
    return "auth.error.server";
  }

  if (isNetworkFailure(error, message)) {
    return "auth.error.network";
  }

  if (context === "register") {
    return "auth.error.registerGeneric";
  }

  if (context === "demo") {
    return "auth.error.demoGeneric";
  }

  return "auth.error.loginGeneric";
}
