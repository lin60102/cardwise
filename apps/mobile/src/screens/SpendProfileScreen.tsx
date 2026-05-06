import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { getBestCardRecommendation, type PurchaseCategory } from "@cardwise/shared";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useFeatureSettings } from "../context/FeatureSettingsContext";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import { api, type WalletCard } from "../services/api";
import { storage, storageKeys } from "../services/storage";
import { colors, spacing } from "../theme";

const PERSONAL_PROFILE_CATEGORIES: PurchaseCategory[] = [
  "Dining",
  "Groceries",
  "Gas",
  "Travel",
  "Flights",
  "Hotels",
  "Amazon",
  "Costco",
  "Target",
  "Drugstores",
  "General purchase"
];

const BUSINESS_PROFILE_CATEGORIES: PurchaseCategory[] = [
  "Office supplies",
  "Shipping",
  "Advertising",
  "Phone & internet",
  "Software & cloud"
];

type SpendProfileValues = Partial<Record<PurchaseCategory, string>>;

interface ProjectionRow {
  category: PurchaseCategory;
  annualSpend: number;
  primaryCardName: string | null;
  rewardTotals: {
    dollars: number;
    points: number;
    miles: number;
  };
}

function parseAmount(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatProjectionReward(row: ProjectionRow) {
  const pieces = [];

  if (row.rewardTotals.dollars > 0) {
    pieces.push(`$${row.rewardTotals.dollars.toFixed(2)}`);
  }

  if (row.rewardTotals.points > 0) {
    pieces.push(`${Math.round(row.rewardTotals.points).toLocaleString()} points`);
  }

  if (row.rewardTotals.miles > 0) {
    pieces.push(`${Math.round(row.rewardTotals.miles).toLocaleString()} miles`);
  }

  return pieces.join(" • ");
}

export function SpendProfileScreen({ navigation }: ScreenProps<"SpendProfile">) {
  const { t, categoryLabel } = useLanguage();
  const { showBusinessCards } = useFeatureSettings();
  const [profile, setProfile] = useState<SpendProfileValues>({});
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = showBusinessCards
    ? [...PERSONAL_PROFILE_CATEGORIES, ...BUSINESS_PROFILE_CATEGORIES]
    : PERSONAL_PROFILE_CATEGORIES;

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const [storedProfile, walletResponse] = await Promise.all([
          storage.getItem(storageKeys.spendProfile),
          api.listWallet()
        ]);
        setProfile(storedProfile ? (JSON.parse(storedProfile) as SpendProfileValues) : {});
        setWallet(walletResponse.cards);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load spend profile.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const projections = useMemo<ProjectionRow[]>(() => {
    const cards = wallet.map((walletCard) => walletCard.card);

    return categories
      .map((category) => {
        const monthlySpend = parseAmount(profile[category]);
        if (monthlySpend <= 0) {
          return null;
        }

        const annualSpend = monthlySpend * 12;
        const rewardTotals = { dollars: 0, points: 0, miles: 0 };
        const annualSpendByCardCategory: Record<string, number> = {};
        let quarterlySpendByCardCategory: Record<string, number> = {};
        const cardWinCounts: Record<string, number> = {};

        for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
          if (monthIndex > 0 && monthIndex % 3 === 0) {
            quarterlySpendByCardCategory = {};
          }

          const recommendation = getBestCardRecommendation({
            cards,
            category,
            purchaseAmount: monthlySpend,
            currentSpendByCardCategory: {
              ...annualSpendByCardCategory,
              ...quarterlySpendByCardCategory
            }
          });
          const bestCard = recommendation.bestCard;

          if (!bestCard) {
            continue;
          }

          rewardTotals[bestCard.estimatedRewardUnit] += bestCard.estimatedRewardAmount;
          cardWinCounts[bestCard.card.name] = (cardWinCounts[bestCard.card.name] ?? 0) + 1;

          const capPeriod = bestCard.matchedCategory?.capPeriod;
          const spendKey = `${bestCard.card.id}:${category}`;
          if (capPeriod === "annual") {
            annualSpendByCardCategory[spendKey] = (annualSpendByCardCategory[spendKey] ?? 0) + monthlySpend;
          } else if (capPeriod === "quarterly") {
            quarterlySpendByCardCategory[spendKey] = (quarterlySpendByCardCategory[spendKey] ?? 0) + monthlySpend;
          }
        }

        const primaryCardName =
          Object.entries(cardWinCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;

        const row: ProjectionRow = {
          category,
          annualSpend,
          primaryCardName,
          rewardTotals
        };

        return row;
      })
      .filter((row): row is ProjectionRow => Boolean(row));
  }, [categories, profile, wallet]);

  const totals = useMemo(() => {
    return projections.reduce(
      (summary, row) => {
        summary.dollars += row.rewardTotals.dollars;
        summary.points += row.rewardTotals.points;
        summary.miles += row.rewardTotals.miles;
        return summary;
      },
      { dollars: 0, points: 0, miles: 0 }
    );
  }, [projections]);

  async function saveProfile() {
    setSaving(true);
    setError(null);

    try {
      await storage.setItem(storageKeys.spendProfile, JSON.stringify(profile));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save spend profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label={t("spendProfile.loading")} />;
  }

  return (
    <Screen>
      <InfoCard>
        <Text style={styles.title}>{t("spendProfile.title")}</Text>
        <Text style={styles.copy}>{t("spendProfile.copy")}</Text>
      </InfoCard>

      <ErrorBanner message={error} />

      <View style={styles.inputList}>
        {categories.map((category) => (
          <View style={styles.inputRow} key={category}>
            <View style={styles.inputLabelWrap}>
              <Text style={styles.inputLabel}>{categoryLabel(category)}</Text>
              <Text style={styles.inputHint}>{t("spendProfile.monthly")}</Text>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={profile[category] ?? ""}
              onChangeText={(value) => setProfile((current) => ({ ...current, [category]: value }))}
              placeholder="0"
              placeholderTextColor={colors.muted}
            />
          </View>
        ))}
      </View>

      <AppButton title={t("spendProfile.save")} onPress={saveProfile} loading={saving} />

      {wallet.length === 0 ? (
        <EmptyState
          title={t("recommend.noWallet.title")}
          message={t("wallet.noCards.message")}
          actionLabel={t("wallet.addCards")}
          onAction={() => navigation.navigate("AddCards")}
        />
      ) : projections.length === 0 ? (
        <EmptyState title={t("spendProfile.empty.title")} message={t("spendProfile.empty.message")} />
      ) : (
        <>
          <InfoCard>
            <Text style={styles.sectionTitle}>{t("spendProfile.projected")}</Text>
            <Text style={styles.total}>${totals.dollars.toFixed(2)}</Text>
            <Text style={styles.copy}>
              {Math.round(totals.points).toLocaleString()} points • {Math.round(totals.miles).toLocaleString()} miles
            </Text>
          </InfoCard>

          <View style={styles.projectionList}>
            {projections.map((row) => (
              <InfoCard key={row.category}>
                <Text style={styles.categoryName}>{categoryLabel(row.category)}</Text>
                <Text style={styles.copy}>${row.annualSpend.toLocaleString()} {t("spendProfile.annualSpend")}</Text>
                {row.primaryCardName ? (
                  <Text style={styles.best}>
                    {row.primaryCardName} • {formatProjectionReward(row)}
                  </Text>
                ) : null}
              </InfoCard>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  inputList: {
    gap: spacing.sm
  },
  inputRow: {
    minHeight: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  inputLabelWrap: {
    flex: 1,
    gap: 3
  },
  inputLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  inputHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  input: {
    width: 108,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: spacing.sm,
    textAlign: "right"
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  total: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900"
  },
  projectionList: {
    gap: spacing.sm
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  best: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900"
  }
});
