import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { FREE_CARD_LIMIT } from "@cardwise/shared";
import { AdBanner } from "../components/AdBanner";
import { AppButton } from "../components/AppButton";
import { CardTile } from "../components/CardTile";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { PlanBadge } from "../components/PlanBadge";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import type { ScreenProps } from "../navigation/types";
import { api, type WalletCard } from "../services/api";
import { getScreenshotWalletCards, isScreenshotMode } from "../services/screenshotMode";
import { colors, spacing } from "../theme";

export function MyWalletScreen({ navigation }: ScreenProps<"MyWallet">) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { colors: themeColors, mode } = useAppTheme();
  const [wallet, setWallet] = useState<WalletCard[]>(() => (isScreenshotMode ? getScreenshotWalletCards() : []));
  const [loading, setLoading] = useState(!isScreenshotMode);
  const [removingCardId, setRemovingCardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const displayName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "CardWise";

  const loadWallet = useCallback(async (isActive: () => boolean) => {
    setError(null);
    try {
      const response = await api.listWallet();
      if (isActive()) {
        setWallet(response.cards);
      }
    } catch (loadError) {
      if (isActive()) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load wallet.");
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isScreenshotMode) {
        return undefined;
      }

      let active = true;
      setLoading(true);
      void loadWallet(() => active);

      return () => {
        active = false;
      };
    }, [loadWallet])
  );

  async function removeCard(walletCardId: string) {
    if (removingCardId) return;

    setError(null);
    setRemovingCardId(walletCardId);
    try {
      await api.removeWalletCard(walletCardId);
      setWallet((current) => current.filter((walletCard) => walletCard.id !== walletCardId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove card.");
    } finally {
      setRemovingCardId(null);
    }
  }

  if (loading) {
    return <LoadingState label={`${t("common.loading")} ${t("wallet.cardsInWallet").toLowerCase()}`} />;
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.topCopy}>
          <Text style={[styles.eyebrow, { color: themeColors.muted }]}>{t("wallet.greeting", { name: displayName })}</Text>
          <Text style={[styles.screenTitle, { color: themeColors.text }]}>{t("wallet.ready")}</Text>
        </View>
      </View>

      <InfoCard tone="success">
        <View style={styles.heroHeader}>
          <View style={[styles.heroIcon, { backgroundColor: themeColors.primary }]}>
            <Feather name="zap" size={22} color={themeColors.surface} />
          </View>
          <PlanBadge plan={user?.plan ?? "FREE"} />
        </View>
        <Text style={[styles.heroTitle, { color: themeColors.text }]}>{t("wallet.quickPick")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("wallet.nextBest")}</Text>
        <View style={styles.actions}>
          <AppButton title={t("common.bestCard")} variant="secondary" onPress={() => navigation.navigate("Recommendation")} />
          <AppButton title={t("wallet.addCards")} onPress={() => navigation.navigate("AddCards")} />
        </View>
      </InfoCard>

      <ErrorBanner message={error} />

      <View style={styles.metricGrid}>
        <InfoCard style={styles.metricCard}>
          <Text style={[styles.stat, { color: themeColors.primary }]}>{wallet.length}</Text>
          <Text style={[styles.metricLabel, { color: themeColors.muted }]}>{t("wallet.cardsSaved")}</Text>
        </InfoCard>
        <InfoCard tone={user?.plan === "PREMIUM" ? "success" : "warm"} style={styles.metricCard}>
          <Text style={[styles.statSmall, { color: themeColors.primary }]}>
            {user?.plan === "PREMIUM" ? "MAX" : Math.max(FREE_CARD_LIMIT - wallet.length, 0)}
          </Text>
          <Text style={[styles.metricLabel, { color: themeColors.muted }]}>
            {user?.plan === "PREMIUM" ? t("wallet.unlimitedShort") : t("wallet.slotsShort")}
          </Text>
        </InfoCard>
      </View>

      {user?.plan === "FREE" ? <AdBanner /> : null}

      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("wallet.cardsInWallet")}</Text>
          <Text style={[styles.sectionCopy, { color: themeColors.muted }]}>
            {user?.plan === "PREMIUM"
              ? t("wallet.unlimited")
              : t("wallet.slotsRemaining", { count: Math.max(FREE_CARD_LIMIT - wallet.length, 0) })}
          </Text>
        </View>
        <Pressable
          style={[styles.textButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          onPress={() =>
            user?.plan === "PREMIUM"
              ? navigation.navigate("AnnualDashboard")
              : navigation.navigate("Paywall", { reason: t("wallet.premiumRequired") })
          }
        >
          <Feather name="bar-chart-2" size={17} color={themeColors.primary} />
          <Text style={[styles.textButtonLabel, { color: themeColors.primary }]}>{t("wallet.annualValue")}</Text>
        </Pressable>
      </View>

      <View style={styles.insightActions}>
        <AppButton title={t("spendProfile.navTitle")} variant="secondary" onPress={() => navigation.navigate("SpendProfile")} />
        <AppButton title={t("bonus.navTitle")} variant="secondary" onPress={() => navigation.navigate("BonusTracker")} />
      </View>

      {wallet.length === 0 ? (
        <EmptyState
          title={t("wallet.noCards.title")}
          message={t("wallet.noCards.message")}
          actionLabel={t("wallet.noCards.action")}
          onAction={() => navigation.navigate("AddCards")}
          icon="plus-circle"
        />
      ) : (
        <View style={styles.list}>
          {wallet.map((walletCard) => (
            <CardTile
              key={walletCard.id}
              card={walletCard.card}
              onPress={() => navigation.navigate("CardDetail", { cardId: walletCard.card.id })}
              trailing={
                <Pressable
                  style={[
                    styles.removeButton,
                    { backgroundColor: mode === "dark" ? "#3A1F1D" : "#FFF1F0" },
                    removingCardId === walletCard.id && styles.disabledButton
                  ]}
                  disabled={removingCardId !== null}
                  onPress={() => void removeCard(walletCard.id)}
                >
                  <Feather name="x" size={18} color={themeColors.danger} />
                </Pressable>
              }
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "800",
    marginBottom: 6
  },
  topCopy: {
    flex: 1
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  heroTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900"
  },
  stat: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "900"
  },
  statSmall: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionHeaderText: {
    flex: 1
  },
  sectionCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  insightActions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  metricGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  metricCard: {
    flex: 1
  },
  textButton: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  textButtonLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  list: {
    gap: spacing.sm
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F0"
  },
  disabledButton: {
    opacity: 0.5
  }
});
