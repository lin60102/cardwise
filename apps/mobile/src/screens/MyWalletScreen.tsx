import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { FREE_CARD_LIMIT } from "@cardwise/shared";
import { AdPlaceholder } from "../components/AdPlaceholder";
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
import type { ScreenProps } from "../navigation/types";
import { api, type WalletCard } from "../services/api";
import { initializeAds } from "../services/ads";
import { colors, spacing } from "../theme";

export function MyWalletScreen({ navigation }: ScreenProps<"MyWallet">) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    setError(null);
    try {
      const response = await api.listWallet();
      setWallet(response.cards);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load wallet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadWallet();
    }, [loadWallet])
  );

  useEffect(() => {
    if (user?.plan === "FREE") {
      void initializeAds();
    }
  }, [user?.plan]);

  async function removeCard(walletCardId: string) {
    setError(null);
    try {
      await api.removeWalletCard(walletCardId);
      setWallet((current) => current.filter((walletCard) => walletCard.id !== walletCardId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove card.");
    }
  }

  if (loading) {
    return <LoadingState label={`${t("common.loading")} ${t("wallet.cardsInWallet").toLowerCase()}`} />;
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>{t("wallet.currentPlan")}</Text>
          <PlanBadge plan={user?.plan ?? "FREE"} />
        </View>
        <Pressable style={styles.iconButton} onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <InfoCard>
        <Text style={styles.stat}>{wallet.length}</Text>
        <Text style={styles.title}>{t("wallet.cardsInWallet")}</Text>
        <Text style={styles.copy}>
          {user?.plan === "PREMIUM"
            ? t("wallet.unlimited")
            : t("wallet.slotsRemaining", { count: Math.max(FREE_CARD_LIMIT - wallet.length, 0) })}
        </Text>
        <View style={styles.actions}>
          <AppButton title={t("wallet.addCards")} onPress={() => navigation.navigate("AddCards")} />
          <AppButton title={t("common.bestCard")} variant="secondary" onPress={() => navigation.navigate("Recommendation")} />
        </View>
      </InfoCard>

      {user?.plan === "FREE" ? <AdPlaceholder /> : null}
      <ErrorBanner message={error} />

      <View style={styles.actions}>
        <AppButton
          title={t("wallet.annualValue")}
          variant="secondary"
          onPress={() =>
            user?.plan === "PREMIUM"
              ? navigation.navigate("AnnualDashboard")
              : navigation.navigate("Paywall", { reason: t("wallet.premiumRequired") })
          }
        />
      </View>

      {wallet.length === 0 ? (
        <EmptyState
          title={t("wallet.noCards.title")}
          message={t("wallet.noCards.message")}
          actionLabel={t("wallet.noCards.action")}
          onAction={() => navigation.navigate("AddCards")}
        />
      ) : (
        <View style={styles.list}>
          {wallet.map((walletCard) => (
            <CardTile
              key={walletCard.id}
              card={walletCard.card}
              onPress={() => navigation.navigate("CardDetail", { cardId: walletCard.card.id })}
              trailing={
                <Pressable style={styles.removeButton} onPress={() => void removeCard(walletCard.id)}>
                  <Feather name="x" size={18} color={colors.danger} />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "800",
    marginBottom: 6
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  stat: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
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
  }
});
