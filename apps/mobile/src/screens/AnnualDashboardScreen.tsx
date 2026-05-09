import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import { api, type WalletCard } from "../services/api";
import { colors, spacing } from "../theme";

export function AnnualDashboardScreen({ navigation }: ScreenProps<"AnnualDashboard">) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const response = await api.listWallet();
        setWallet(response.cards);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    void loadWallet();
  }, []);

  const summary = useMemo(() => {
    const annualFees = wallet.reduce((sum, walletCard) => sum + walletCard.card.annualFee, 0);
    const annualCredits = wallet.reduce(
      (sum, walletCard) =>
        sum + (walletCard.card.benefits ?? []).reduce((benefitSum, benefit) => benefitSum + (benefit.annualValue ?? 0), 0),
      0
    );

    return {
      annualFees,
      annualCredits,
      netCredits: annualCredits - annualFees
    };
  }, [wallet]);

  if (loading) {
    return <LoadingState label={t("dashboard.loading")} />;
  }

  if (user?.plan !== "PREMIUM") {
    return (
      <Screen>
        <EmptyState
          title={t("dashboard.premium.title")}
          message={t("dashboard.premium.message")}
          actionLabel={t("dashboard.premium.action")}
          onAction={() => navigation.navigate("Paywall", { reason: t("dashboard.premium.message") })}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ErrorBanner message={error} />
      <Image
        source={require("../../assets/images/cardwise-dashboard-hero.png")}
        style={styles.heroImage}
        resizeMode="contain"
      />
      <InfoCard tone="success">
        <Text style={styles.kicker}>{t("dashboard.title")}</Text>
        <Text style={styles.net}>${summary.netCredits.toLocaleString()}</Text>
        <Text style={styles.copy}>{t("dashboard.copy")}</Text>
      </InfoCard>

      <View style={styles.grid}>
        <InfoCard style={styles.metricCard}>
          <Text style={styles.metric}>${summary.annualCredits.toLocaleString()}</Text>
          <Text style={styles.label}>{t("dashboard.credits")}</Text>
        </InfoCard>
        <InfoCard tone="warm" style={styles.metricCard}>
          <Text style={styles.metric}>${summary.annualFees.toLocaleString()}</Text>
          <Text style={styles.label}>{t("dashboard.fees")}</Text>
        </InfoCard>
      </View>

      {wallet.length === 0 ? (
        <EmptyState
          title={t("dashboard.empty.title")}
          message={t("dashboard.empty.message")}
          actionLabel={t("wallet.addCards")}
          onAction={() => navigation.navigate("AddCards")}
        />
      ) : (
        <View style={styles.list}>
          {wallet.map((walletCard) => {
            const credits = (walletCard.card.benefits ?? []).reduce(
              (sum, benefit) => sum + (benefit.annualValue ?? 0),
              0
            );
            return (
              <InfoCard key={walletCard.id}>
                <Text style={styles.cardName}>{walletCard.card.name}</Text>
                <Text style={styles.cardMeta}>
                  ${credits.toLocaleString()} credits - ${walletCard.card.annualFee.toLocaleString()} fee = $
                  {(credits - walletCard.card.annualFee).toLocaleString()}
                </Text>
              </InfoCard>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  heroImage: {
    width: "100%",
    height: 210,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  net: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  grid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  metricCard: {
    flex: 1
  },
  metric: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4
  },
  list: {
    gap: spacing.sm
  },
  cardName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
