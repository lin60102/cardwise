import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { PlanBadge } from "../components/PlanBadge";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useFeatureSettings } from "../context/FeatureSettingsContext";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import { colors, spacing } from "../theme";

export function SettingsScreen({ navigation }: ScreenProps<"Settings">) {
  const { user, logout, refreshSubscription } = useAuth();
  const { t } = useLanguage();
  const { showBusinessCards, setShowBusinessCards } = useFeatureSettings();
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function refreshPlan() {
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
    if (user?.plan !== "PREMIUM") {
      navigation.navigate("Paywall", { reason: t("settings.businessCardsPremium") });
      return;
    }

    await setShowBusinessCards(!showBusinessCards);
  }

  return (
    <Screen>
      <ErrorBanner message={error} />

      <InfoCard>
        <Text style={styles.label}>{t("settings.signedInAs")}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <PlanBadge plan={user?.plan ?? "FREE"} />
      </InfoCard>

      <InfoCard>
        <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
        <Text style={styles.copy}>{t("settings.languageCopy")}</Text>
        <LanguageToggle />
      </InfoCard>

      <InfoCard>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.sectionTitle}>{t("settings.businessCards")}</Text>
            <Text style={styles.copy}>{t("settings.businessCardsCopy")}</Text>
            <Text style={styles.status}>{showBusinessCards ? t("settings.enabled") : t("settings.disabled")}</Text>
          </View>
          <Switch
            value={showBusinessCards}
            onValueChange={() => void toggleBusinessCards()}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </InfoCard>

      <InfoCard>
        <Text style={styles.sectionTitle}>{t("settings.subscription")}</Text>
        <Text style={styles.copy}>{t("settings.subscriptionCopy")}</Text>
        <View style={styles.actions}>
          <AppButton title={t("settings.refresh")} variant="secondary" onPress={refreshPlan} loading={refreshing} />
          {user?.plan === "FREE" ? (
            <AppButton title={t("settings.viewPremium")} onPress={() => navigation.navigate("Paywall", { reason: t("settings.viewPremium") })} />
          ) : null}
        </View>
      </InfoCard>

      <InfoCard>
        <Text style={styles.sectionTitle}>{t("settings.freeRules")}</Text>
        <Text style={styles.copy}>{t("settings.freeRulesCopy")}</Text>
      </InfoCard>

      <AppButton title={t("settings.logout")} variant="danger" onPress={() => void logout()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  }
});
