import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../components/Screen";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { getAuthErrorMessageKey } from "../services/authErrorMessage";
import { colors, spacing } from "../theme";

export function LoginRegisterScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();

  async function submit() {
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
            <Pressable style={[styles.segmentButton, mode === "login" && { backgroundColor: themeColors.surface }]} onPress={() => setMode("login")}>
              <Text style={[styles.segmentText, { color: mode === "login" ? themeColors.primary : themeColors.muted }]}>{t("auth.login")}</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, mode === "register" && { backgroundColor: themeColors.surface }]}
              onPress={() => setMode("register")}
            >
              <Text style={[styles.segmentText, { color: mode === "register" ? themeColors.primary : themeColors.muted }]}>{t("auth.register")}</Text>
            </Pressable>
          </View>

          <ErrorBanner message={error} />

          <View style={styles.form}>
            {mode === "register" ? (
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
                placeholder={t("auth.name")}
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
              />
            ) : null}
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
              placeholder={t("auth.email")}
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
              placeholder={t("auth.password")}
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <AppButton
            title={mode === "login" ? t("auth.login") : t("auth.createAccount")}
            onPress={submit}
            loading={loading}
            disabled={!email || !password || (mode === "register" && password.length < 8)}
          />
        </InfoCard>

        <InfoCard tone="info">
          <Text style={[styles.demoCopy, { color: themeColors.muted }]}>{t("auth.demoCopy")}</Text>
          <AppButton title={t("common.tryDemo")} variant="secondary" onPress={continueDemo} loading={loading} />
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
  demoCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
