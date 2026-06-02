export function isRuntimeDiagnosticsEnabled() {
  return (
    process.env.EXPO_PUBLIC_ADMOB_DEBUG === "true" ||
    process.env.EXPO_PUBLIC_AUTH_DEBUG === "true" ||
    process.env.EXPO_PUBLIC_SCREENSHOT_DEBUG === "true"
  );
}

export function debugRuntime(namespace: string, message: string, details?: Record<string, unknown>) {
  if (isRuntimeDiagnosticsEnabled()) {
    console.log(`[CardWise/${namespace}] ${message}`, details ?? {});
  }
}
