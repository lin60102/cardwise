import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../components/Screen";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
      setError(submitError instanceof Error ? submitError.message : "Unable to continue.");
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
      setError(demoError instanceof Error ? demoError.message : "Unable to start demo mode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <LanguageToggle />
        <View style={styles.header}>
          <Text style={styles.brand}>CardWise</Text>
          <Text style={styles.title}>{mode === "login" ? t("auth.welcome") : t("auth.create")}</Text>
          <Text style={styles.subtitle}>{t("auth.subtitle")}</Text>
        </View>

        <View style={styles.segment}>
          <Pressable style={[styles.segmentButton, mode === "login" && styles.segmentActive]} onPress={() => setMode("login")}>
            <Text style={[styles.segmentText, mode === "login" && styles.segmentTextActive]}>{t("auth.login")}</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, mode === "register" && styles.segmentActive]}
            onPress={() => setMode("register")}
          >
            <Text style={[styles.segmentText, mode === "register" && styles.segmentTextActive]}>{t("auth.register")}</Text>
          </Pressable>
        </View>

        <ErrorBanner message={error} />

        <View style={styles.form}>
          {mode === "register" ? (
            <TextInput
              style={styles.input}
              placeholder={t("auth.name")}
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />
          ) : null}
          <TextInput
            style={styles.input}
            placeholder={t("auth.email")}
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
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

        <InfoCard>
          <Text style={styles.demoCopy}>{t("auth.demoCopy")}</Text>
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
  header: {
    paddingTop: spacing.xl,
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
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
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
  segmentActive: {
    backgroundColor: colors.surface
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.primary
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
