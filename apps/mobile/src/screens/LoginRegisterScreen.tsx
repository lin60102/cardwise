import { useMemo, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { AppleSignInPayload } from "../services/api";
import { Screen } from "../components/Screen";
import { AppleSignInButton } from "../components/AppleSignInButton";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { getAuthErrorMessageKey } from "../services/authErrorMessage";
import { PASSWORD_MIN_LENGTH, getPrimaryAuthValidationMessageKey, validateAuthForm } from "../services/authValidation";
import { colors, spacing } from "../theme";

type FieldName = "email" | "password" | "name";
type TouchedMap = Record<FieldName, boolean>;

const UNTOUCHED: TouchedMap = { email: false, password: false, name: false };
const ALL_TOUCHED: TouchedMap = { email: true, password: true, name: true };

export function LoginRegisterScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState<TouchedMap>(UNTOUCHED);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();

  // Live form validity — recomputed whenever the user types or switches mode.
  const validation = useMemo(
    () => validateAuthForm({ email, password, name, mode }),
    [email, password, name, mode]
  );
  const disabledReasonKey = !loading && !validation.valid ? getPrimaryAuthValidationMessageKey(validation) : undefined;

  function markTouched(field: FieldName) {
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  }

  function switchMode(next: "login" | "register") {
    if (next === mode) return;
    setMode(next);
    // Switching modes shouldn't immediately flag previously-untouched fields as
    // invalid (e.g. the password rule changes between login and register).
    setTouched(UNTOUCHED);
    setError(null);
  }

  async function submit() {
    if (loading) return;

    // Reveal any pending validation messages on submit attempt.
    setTouched(ALL_TOUCHED);
    if (!validation.valid) return;

    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await auth.login(email.trim(), password);
      } else {
        await auth.register(email.trim(), password, name.trim() || undefined);
      }
    } catch (submitError) {
      setError(t(getAuthErrorMessageKey(submitError, mode)));
    } finally {
      setLoading(false);
    }
  }

  async function continueDemo() {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      await auth.continueAsDemo();
    } catch (demoError) {
      setError(t(getAuthErrorMessageKey(demoError, "demo")));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithApple(payload: AppleSignInPayload) {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      await auth.loginWithApple(payload);
    } catch (appleError) {
      setError(t(getAuthErrorMessageKey(appleError, "apple")));
    } finally {
      setLoading(false);
    }
  }

  // Inline error visible only after the field has been touched (blurred or submit attempted).
  const emailError = touched.email && !validation.email.valid ? validation.email.messageKey : undefined;
  const passwordError = touched.password && !validation.password.valid ? validation.password.messageKey : undefined;

  // Helper text under the password field — always visible in register mode while no error is showing.
  const showPasswordHelper = mode === "register" && !passwordError;

  function inputBorderColor(field: FieldName) {
    const hasError =
      (field === "email" && emailError) || (field === "password" && passwordError);
    return hasError ? themeColors.danger : themeColors.border;
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <View style={styles.topRow}>
          <Text style={[styles.brand, { color: themeColors.primary }]}>CardWise</Text>
          <LanguageToggle />
        </View>

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: themeColors.text }]}>{mode === "login" ? t("auth.welcome") : t("auth.create")}</Text>
            <Text style={[styles.subtitle, { color: themeColors.muted }]}>{t("auth.subtitle")}</Text>
          </View>
          <Image
            source={require("../../assets/images/cardwise-onboarding-hero.png")}
            style={[styles.heroImage, { borderColor: themeColors.border, backgroundColor: themeColors.surfaceAlt }]}
            resizeMode="contain"
          />
        </View>

        <InfoCard>
          <View style={[styles.segment, { backgroundColor: themeColors.surfaceAlt }]}>
            <Pressable style={[styles.segmentButton, mode === "login" && { backgroundColor: themeColors.surface }]} onPress={() => switchMode("login")}>
              <Text style={[styles.segmentText, { color: mode === "login" ? themeColors.primary : themeColors.muted }]}>{t("auth.login")}</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, mode === "register" && { backgroundColor: themeColors.surface }]}
              onPress={() => switchMode("register")}
            >
              <Text style={[styles.segmentText, { color: mode === "register" ? themeColors.primary : themeColors.muted }]}>{t("auth.register")}</Text>
            </Pressable>
          </View>

          <ErrorBanner message={error} />

          <View style={styles.form}>
            {mode === "register" ? (
              <View style={styles.field}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }
                  ]}
                  placeholder={t("auth.name")}
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  onBlur={() => markTouched("name")}
                />
              </View>
            ) : null}

            <View style={styles.field}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.surface, borderColor: inputBorderColor("email"), color: themeColors.text }
                ]}
                placeholder={t("auth.email")}
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                onBlur={() => markTouched("email")}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel={t("auth.email")}
              />
              {emailError ? (
                <Text style={[styles.fieldError, { color: themeColors.danger }]} accessibilityRole="alert">
                  {t(emailError)}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themeColors.surface, borderColor: inputBorderColor("password"), color: themeColors.text }
                ]}
                placeholder={t("auth.password")}
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                onBlur={() => markTouched("password")}
                secureTextEntry
                accessibilityLabel={t("auth.password")}
              />
              {passwordError ? (
                <Text style={[styles.fieldError, { color: themeColors.danger }]} accessibilityRole="alert">
                  {t(passwordError, { min: PASSWORD_MIN_LENGTH })}
                </Text>
              ) : showPasswordHelper ? (
                <Text style={[styles.fieldHelper, { color: themeColors.muted }]}>
                  {t("auth.password.helper", { min: PASSWORD_MIN_LENGTH })}
                </Text>
              ) : null}
            </View>
          </View>

          <AppButton
            title={mode === "login" ? t("auth.login") : t("auth.createAccount")}
            onPress={submit}
            loading={loading}
            disabled={!validation.valid || loading}
          />
          {disabledReasonKey ? (
            <Text style={[styles.disabledReason, { color: themeColors.muted }]}>
              {mode === "register"
                ? t("auth.disabled.register", { reason: t(disabledReasonKey, { min: PASSWORD_MIN_LENGTH }) })
                : t("auth.disabled.login", { reason: t(disabledReasonKey, { min: PASSWORD_MIN_LENGTH }) })}
            </Text>
          ) : null}
          <AppleSignInButton
            loading={loading}
            separatorLabel={t("auth.or")}
            onSuccess={signInWithApple}
            onError={(appleError) => setError(t(getAuthErrorMessageKey(appleError, "apple")))}
          />
        </InfoCard>

        <InfoCard tone="info">
          <Text style={[styles.demoCopy, { color: themeColors.muted }]}>{t("auth.demoCopy")}</Text>
          <AppButton title={t("common.tryDemo")} variant="secondary" onPress={continueDemo} loading={loading} disabled={loading} />
        </InfoCard>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  header: {
    gap: spacing.md
  },
  headerCopy: {
    gap: spacing.sm
  },
  brand: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  heroImage: {
    width: "100%",
    height: 190,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  segment: {
    backgroundColor: colors.surfaceAlt,
    padding: 4,
    borderRadius: 8,
    flexDirection: "row"
  },
  segmentButton: {
    flex: 1,
    borderRadius: 7,
    paddingVertical: spacing.sm,
    alignItems: "center"
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "800"
  },
  form: {
    gap: spacing.sm
  },
  field: {
    gap: 6
  },
  input: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16
  },
  fieldHelper: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: spacing.xs
  },
  fieldError: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    paddingHorizontal: spacing.xs
  },
  disabledReason: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: spacing.sm
  },
  demoCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
