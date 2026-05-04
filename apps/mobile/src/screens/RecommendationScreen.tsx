import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PURCHASE_CATEGORIES, type PurchaseCategory, type RecommendationResult } from "@cardwise/shared";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { colors, spacing } from "../theme";

function formatRate(rate: number, rewardType?: string) {
  const value = Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
  return rewardType === "cashback" ? `${value}%` : `${value}x`;
}

export function RecommendationScreen() {
  const { t, categoryLabel } = useLanguage();
  const [category, setCategory] = useState<PurchaseCategory>("Dining");
  const [purchaseAmount, setPurchaseAmount] = useState("100");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recommend() {
    setError(null);
    setLoading(true);

    try {
      const amount = Number(purchaseAmount);
      const response = await api.recommendBestCard({
        category,
        purchaseAmount: Number.isFinite(amount) && amount > 0 ? amount : undefined
      });
      setResult(response);
    } catch (recommendError) {
      setError(recommendError instanceof Error ? recommendError.message : "Unable to get recommendation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>{t("recommend.title")}</Text>
      <View style={styles.categoryGrid}>
        {PURCHASE_CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[styles.categoryChip, item === category && styles.categoryChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, item === category && styles.categoryTextActive]}>{categoryLabel(item)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputWrap}>
        <Text style={styles.label}>{t("recommend.amount")}</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={purchaseAmount}
          onChangeText={setPurchaseAmount}
          placeholder="100"
          placeholderTextColor={colors.muted}
        />
      </View>

      <ErrorBanner message={error} />
      <AppButton title={t("recommend.cta")} onPress={recommend} loading={loading} />

      {result?.bestCard ? (
        <>
          <InfoCard>
            <Text style={styles.bestLabel}>{t("common.bestCard")}</Text>
            <Text style={styles.bestName}>{result.bestCard.card.name}</Text>
            <Text style={styles.bestRate}>
              {formatRate(result.bestCard.effectiveRewardRate, result.bestCard.card.rewardType)} {t("recommend.estimated")}
            </Text>
            <Text style={styles.explanation}>{result.explanation}</Text>
          </InfoCard>

          <Text style={styles.sectionTitle}>{t("recommend.ranked")}</Text>
          <View style={styles.rankList}>
            {result.rankedCards.map((rankedCard, index) => (
              <InfoCard key={rankedCard.card.id}>
                <View style={styles.rankRow}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                  <View style={styles.rankBody}>
                    <Text style={styles.rankName}>{rankedCard.card.name}</Text>
                    <Text style={styles.rankMeta}>
                      {formatRate(rankedCard.effectiveRewardRate, rankedCard.card.rewardType)}
                      {rankedCard.capApplied ? ` ${t("recommend.afterCap")}` : ""}
                    </Text>
                  </View>
                </View>
              </InfoCard>
            ))}
          </View>
        </>
      ) : result ? (
        <EmptyState title={t("recommend.noWallet.title")} message={result.explanation} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  categoryChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryText: {
    color: colors.text,
    fontWeight: "800"
  },
  categoryTextActive: {
    color: colors.surface
  },
  inputWrap: {
    gap: 6
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  input: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 18,
    paddingHorizontal: spacing.md
  },
  bestLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  bestName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  bestRate: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900"
  },
  explanation: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  rankList: {
    gap: spacing.sm
  },
  rankRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center"
  },
  rankNumber: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    width: 42
  },
  rankBody: {
    flex: 1,
    gap: 4
  },
  rankName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  rankMeta: {
    color: colors.muted,
    fontSize: 14
  }
});
