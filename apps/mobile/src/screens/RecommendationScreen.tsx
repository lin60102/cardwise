import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PURCHASE_CATEGORIES, type PurchaseCategory, type RecommendationResult } from "@cardwise/shared";
import { AppButton } from "../components/AppButton";
import { AdBanner } from "../components/AdBanner";
import { CategoryVisual } from "../components/CategoryVisual";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import { colors, spacing } from "../theme";
import { formatEstimatedReward } from "../utils/rewardFormatting";

function formatRate(rate: number, rewardType?: string) {
  const value = Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
  return rewardType === "cashback" ? `${value}%` : `${value}x`;
}

export function RecommendationScreen() {
  const { user } = useAuth();
  const { t, categoryLabel } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const [category, setCategory] = useState<PurchaseCategory>("Dining");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [showAmountDetails, setShowAmountDetails] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedCategoryLabel = categoryLabel(category);

  async function recommend() {
    setError(null);
    setLoading(true);

    try {
      const amount = Number(purchaseAmount);
      const response = await api.recommendBestCard({
        category,
        purchaseAmount: showAmountDetails && Number.isFinite(amount) && amount > 0 ? amount : undefined
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
      <Text style={[styles.title, { color: themeColors.text }]}>{t("recommend.title")}</Text>
      <Text style={[styles.subtitle, { color: themeColors.muted }]}>{t("recommend.copy")}</Text>

      <InfoCard tone="info">
        <View style={styles.summaryRow}>
          <View style={[styles.summaryIcon, { backgroundColor: themeColors.surface }]}>
            <CategoryVisual category={category} color={themeColors.info} size={25} />
          </View>
          <View style={styles.summaryText}>
            <Text style={[styles.summaryLabel, { color: themeColors.muted }]}>{t("recommend.selected")}</Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>{selectedCategoryLabel}</Text>
          </View>
        </View>
      </InfoCard>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroller}
        contentContainerStyle={styles.categoryGrid}
      >
        {PURCHASE_CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoryChip,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
              item === category && { backgroundColor: themeColors.primary, borderColor: themeColors.primary }
            ]}
            onPress={() => setCategory(item)}
          >
            <CategoryVisual category={item} color={item === category ? themeColors.surface : themeColors.primary} size={20} />
            <Text style={[styles.categoryText, { color: item === category ? themeColors.surface : themeColors.text }]}>
              {categoryLabel(item)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        style={[styles.amountToggle, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
        onPress={() => setShowAmountDetails((current) => !current)}
        accessibilityRole="button"
      >
        <View style={styles.amountToggleIcon}>
          <Feather name="sliders" size={17} color={themeColors.primary} />
        </View>
        <View style={styles.amountToggleText}>
          <Text style={[styles.amountToggleTitle, { color: themeColors.text }]}>{t("recommend.amountToggle")}</Text>
          <Text style={[styles.amountToggleCopy, { color: themeColors.muted }]}>{t("recommend.amountToggleCopy")}</Text>
        </View>
        <Feather name={showAmountDetails ? "chevron-up" : "chevron-down"} size={20} color={themeColors.muted} />
      </Pressable>

      {showAmountDetails ? (
        <InfoCard tone="warm">
          <Text style={[styles.amountHelp, { color: themeColors.muted }]}>{t("recommend.amountHelp")}</Text>
          <View style={styles.inputWrap}>
            <Text style={[styles.label, { color: themeColors.muted }]}>{t("recommend.amount")}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
              keyboardType="decimal-pad"
              value={purchaseAmount}
              onChangeText={setPurchaseAmount}
              placeholder="1500"
              placeholderTextColor={colors.muted}
            />
          </View>
        </InfoCard>
      ) : null}

      <ErrorBanner message={error} />
      <AppButton title={t("recommend.cta")} onPress={recommend} loading={loading} />

      {result?.bestCard ? (
        <>
          <InfoCard tone="success">
            <View style={styles.bestHeader}>
              <View style={styles.bestIcon}>
                <Feather name="check-circle" size={22} color={themeColors.surface} />
              </View>
              <Text style={[styles.bestLabel, { color: themeColors.primary }]}>{t("recommend.bestFor", { category: selectedCategoryLabel })}</Text>
            </View>
            <Text style={[styles.bestName, { color: themeColors.text }]}>{result.bestCard.card.name}</Text>
            <Text style={[styles.bestRate, { color: themeColors.accent }]}>
              {formatRate(result.bestCard.effectiveRewardRate, result.bestCard.card.rewardType)} {t("recommend.estimated")}
            </Text>
            <Text style={[styles.rewardAmount, { color: themeColors.primary }]}>
              {formatEstimatedReward(result.bestCard)} {t("recommend.onPurchase")}
            </Text>
            <Text style={[styles.explanation, { color: themeColors.muted }]}>{result.explanation}</Text>
          </InfoCard>

          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("recommend.ranked")}</Text>
          <View style={styles.rankList}>
            {result.rankedCards.map((rankedCard, index) => (
              <InfoCard key={rankedCard.card.id}>
                <View style={styles.rankRow}>
                  <View style={[styles.rankNumber, { backgroundColor: themeColors.surfaceAlt }]}>
                    <Text style={[styles.rankNumberText, { color: themeColors.primary }]}>#{index + 1}</Text>
                  </View>
                  <View style={styles.rankBody}>
                    <Text style={[styles.rankName, { color: themeColors.text }]}>{rankedCard.card.name}</Text>
                    <Text style={[styles.rankMeta, { color: themeColors.muted }]}>
                      {formatRate(rankedCard.effectiveRewardRate, rankedCard.card.rewardType)}
                      {" • "}
                      {formatEstimatedReward(rankedCard)}
                      {rankedCard.capApplied ? ` ${t("recommend.afterCap")}` : ""}
                    </Text>
                  </View>
                </View>
              </InfoCard>
            ))}
          </View>
        </>
      ) : result ? (
        <EmptyState title={t("recommend.noWallet.title")} message={result.explanation} icon="briefcase" />
      ) : null}

      {user?.plan === "FREE" ? <AdBanner /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  summaryText: {
    flex: 1
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  summaryValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  categoryGrid: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  categoryScroller: {
    maxHeight: 58
  },
  categoryChip: {
    minHeight: 50,
    minWidth: 118,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  categoryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  amountToggle: {
    minHeight: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  amountToggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt
  },
  amountToggleText: {
    flex: 1,
    gap: 2
  },
  amountToggleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  amountToggleCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  amountHelp: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
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
  bestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  bestIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
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
  rewardAmount: {
    color: colors.primary,
    fontSize: 16,
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
    alignItems: "flex-start"
  },
  rankNumber: {
    width: 42,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt
  },
  rankNumberText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900"
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
