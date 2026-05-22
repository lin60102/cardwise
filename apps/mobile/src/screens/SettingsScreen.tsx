import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { PlanBadge } from "../components/PlanBadge";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useFeatureSettings } from "../context/FeatureSettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import type { ScreenProps } from "../navigation/types";
import { colors, spacing, type ThemeMode } from "../theme";

export function SettingsScreen({ navigation }: ScreenProps<"Settings">) {
  const { user, logout, refreshSubscription, redeemPromoCode } = useAuth();
  const { t, language } = useLanguage();
  const { mode, setMode, colors: themeColors } = useAppTheme();
  const { showBusinessCards, setShowBusinessCards } = useFeatureSettings();
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [redeemingPromo, setRedeemingPromo] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingBusinessCards, setUpdatingBusinessCards] = useState(false);

  async function refreshPlan() {
    if (refreshing) return;

    setError(null);
    setRefreshing(true);

    try {
      await refreshSubscription();
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Unable to refresh subscription.");
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleBusinessCards() {
    if (updatingBusinessCards) return;

    if (user?.plan !== "PREMIUM") {
      navigation.navigate("Paywall", { reason: t("settings.businessCardsPremium") });
      return;
    }

    setUpdatingBusinessCards(true);
    setError(null);
    try {
      await setShowBusinessCards(!showBusinessCards);
    } catch (settingsError) {
      setError(settingsError instanceof Error ? settingsError.message : "Unable to update business card settings.");
    } finally {
      setUpdatingBusinessCards(false);
    }
  }

  async function selectTheme(nextMode: ThemeMode) {
    try {
      await setMode(nextMode);
    } catch (themeError) {
      setError(themeError instanceof Error ? themeError.message : "Unable to update theme.");
    }
  }

  async function submitPromoCode() {
    if (redeemingPromo) return;

    setError(null);
    setPromoMessage(null);
    setRedeemingPromo(true);

    try {
      await redeemPromoCode(promoCode);
      setPromoCode("");
      setPromoMessage(t("settings.promoSuccess"));
    } catch (promoError) {
      setError(promoError instanceof Error ? promoError.message : t("settings.promoError"));
    } finally {
      setRedeemingPromo(false);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError(null);
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to log out.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: themeColors.text }]}>{t("common.settings")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.preferences")}</Text>
      </View>
      <ErrorBanner message={error} />

      <InfoCard>
        <Text style={[styles.label, { color: themeColors.muted }]}>{t("settings.signedInAs")}</Text>
        <Text style={[styles.email, { color: themeColors.text }]}>{user?.email}</Text>
        <PlanBadge plan={user?.plan ?? "FREE"} />
      </InfoCard>

      <InfoCard>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("settings.preferences")}</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>{t("settings.language")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.languageCopy")}</Text>
            <Text style={[styles.status, { color: themeColors.primary }]}>
              {t("settings.currentLanguage", { language: t(`language.${language}`) })}
            </Text>
          </View>
          <LanguageToggle />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingText}>
          <Text style={[styles.optionTitle, { color: themeColors.text }]}>{t("settings.appearance")}</Text>
          <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.appearanceCopy")}</Text>
        </View>
        <View style={styles.themeOptions}>
          {(["light", "dark"] as const).map((item) => {
            const selected = mode === item;
            return (
              <Pressable
                key={item}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: selected ? themeColors.primary : themeColors.surfaceAlt,
                    borderColor: selected ? themeColors.primary : themeColors.border
                  }
                ]}
                onPress={() => void selectTheme(item)}
              >
                <Text style={[styles.themeOptionText, { color: selected ? themeColors.surface : themeColors.primaryDark }]}>
                  {t(`theme.${item}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </InfoCard>

      <InfoCard>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("settings.businessCards")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.businessCardsCopy")}</Text>
            <Text style={[styles.status, { color: themeColors.primary }]}>{showBusinessCards ? t("settings.enabled") : t("settings.disabled")}</Text>
          </View>
          <Switch
            value={showBusinessCards}
            onValueChange={() => void toggleBusinessCards()}
            disabled={updatingBusinessCards}
            trackColor={{ false: themeColors.border, true: themeColors.primary }}
            thumbColor={themeColors.surface}
          />
        </View>
      </InfoCard>

      <InfoCard>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("settings.subscription")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.subscriptionCopy")}</Text>
        <View style={styles.actions}>
          <AppButton title={t("settings.refresh")} variant="secondary" onPress={refreshPlan} loading={refreshing} />
          {user?.plan === "FREE" ? (
            <AppButton title={t("settings.viewPremium")} onPress={() => navigation.navigate("Paywall", { reason: t("settings.viewPremium") })} />
          ) : null}
        </View>
      </InfoCard>

      <InfoCard tone="success">
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("settings.promoTitle")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.promoCopy")}</Text>
        {promoMessage ? <Text style={[styles.status, { color: themeColors.success }]}>{promoMessage}</Text> : null}
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
          placeholder={t("settings.promoPlaceholder")}
          placeholderTextColor={colors.muted}
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <AppButton
          title={t("settings.promoRedeem")}
          onPress={submitPromoCode}
          loading={redeemingPromo}
          disabled={!promoCode.trim() || redeemingPromo}
        />
      </InfoCard>

      <InfoCard tone="warm">
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("support.title")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("support.settingsCopy")}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            style={[styles.supportButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
            onPress={() => navigation.navigate("Support")}
          >
            <Feather name="heart" size={19} color={themeColors.accent} />
            <Text style={[styles.supportButtonText, { color: themeColors.primaryDark }]}>{t("support.navTitle")}</Text>
          </Pressable>
        </View>
      </InfoCard>

      <InfoCard>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("settings.freeRules")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("settings.freeRulesCopy")}</Text>
      </InfoCard>

      <AppButton title={t("settings.logout")} variant="danger" onPress={() => void handleLogout()} loading={loggingOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  email: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  optionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  settingText: {
    flex: 1,
    gap: 6
  },
  status: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs
  },
  themeOptions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  themeOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: "900"
  },
  supportButton: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  supportButtonText: {
    fontSize: 13,
    fontWeight: "900"
  }
});
