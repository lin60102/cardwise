import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatRewardRate, type CreditCardLike } from "@cardwise/shared";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import { api } from "../services/api";
import { colors, spacing } from "../theme";

function formatRewardType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function CardDetailScreen({ route, navigation }: ScreenProps<"CardDetail">) {
  const { t, categoryLabel } = useLanguage();
  const [card, setCard] = useState<CreditCardLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCard() {
      setError(null);
      try {
        const response = await api.getCard(route.params.cardId);
        setCard(response.card);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load card.");
      } finally {
        setLoading(false);
      }
    }

    void loadCard();
  }, [route.params.cardId]);

  if (loading) {
    return <LoadingState label={t("detail.loading")} />;
  }

  if (!card) {
    return (
      <Screen>
        <ErrorBanner message={error} />
        <EmptyState title={t("detail.unavailable.title")} message={t("detail.unavailable.message")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ErrorBanner message={error} />

      <InfoCard tone="info">
        <Text style={styles.issuer}>{card.issuer}</Text>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.type}>{t(`cardType.${card.cardType}`)}</Text>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>${card.annualFee}</Text>
            <Text style={styles.metricLabel}>{t("detail.annualFee")}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatRewardRate(card.baseRewardRate, card.rewardType, { fractionDigits: 1 })}</Text>
            <Text style={styles.metricLabel}>{t("detail.baseRate")}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{card.foreignTransactionFee}%</Text>
            <Text style={styles.metricLabel}>{t("detail.fxFee")}</Text>
          </View>
        </View>
        <Text style={styles.notes}>
          {formatRewardType(card.rewardType)} rewards{card.notes ? `. ${card.notes}` : "."}
        </Text>
      </InfoCard>

      <Text style={styles.sectionTitle}>{t("detail.rewardCategories")}</Text>
      <View style={styles.list}>
        {card.rewardCategories.map((reward) => (
          <InfoCard key={reward.id ?? `${reward.category}-${reward.rate}`}>
            <View style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{categoryLabel(reward.category)}</Text>
                <Text style={styles.rowMeta}>{reward.label ?? t("detail.eligible")}</Text>
              </View>
              <Text style={styles.rate}>{formatRewardRate(reward.rate, card.rewardType, { fractionDigits: 1 })}</Text>
            </View>
            {reward.capAmount ? (
              <Text style={styles.cap}>
                {t("detail.cap", { amount: reward.capAmount.toLocaleString(), period: reward.capPeriod ?? "" })}
              </Text>
            ) : null}
          </InfoCard>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t("detail.benefits")}</Text>
      {card.benefits && card.benefits.length > 0 ? (
        <View style={styles.list}>
          {card.benefits.map((benefit) => (
            <InfoCard key={benefit.id ?? benefit.title}>
              <Text style={styles.rowTitle}>{benefit.title}</Text>
              <Text style={styles.rowMeta}>{benefit.description ?? "Card benefit"}</Text>
              {benefit.annualValue ? <Text style={styles.value}>{t("detail.estimatedValue", { amount: benefit.annualValue })}</Text> : null}
            </InfoCard>
          ))}
        </View>
      ) : (
        <EmptyState title={t("detail.noCredits.title")} message={t("detail.noCredits.message")} />
      )}

      <AppButton title={t("common.backToWallet")} variant="ghost" onPress={() => navigation.navigate("MyWallet")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  issuer: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  type: {
    alignSelf: "flex-start",
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "900"
  },
  metrics: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  metric: {
    flex: 1,
    minWidth: 88,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: spacing.sm
  },
  metricValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  notes: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  list: {
    gap: spacing.sm
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  rowBody: {
    flex: 1,
    gap: 4
  },
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  rowMeta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  rate: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900"
  },
  cap: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800"
  },
  value: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900"
  }
});
