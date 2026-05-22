import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatRewardTotals, getSpendProjection, type PurchaseCategory } from "@cardwise/shared";
import { AppButton } from "../components/AppButton";
import { CategoryVisual } from "../components/CategoryVisual";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useFeatureSettings } from "../context/FeatureSettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
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

function parseAmount(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function SpendProfileScreen({ navigation }: ScreenProps<"SpendProfile">) {
  const { t, categoryLabel } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const { showBusinessCards } = useFeatureSettings();
  const [profile, setProfile] = useState<SpendProfileValues>({});
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => (showBusinessCards ? [...PERSONAL_PROFILE_CATEGORIES, ...BUSINESS_PROFILE_CATEGORIES] : PERSONAL_PROFILE_CATEGORIES),
    [showBusinessCards]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setError(null);
      try {
        const [storedProfile, walletResponse] = await Promise.all([
          storage.getItem(storageKeys.spendProfile),
          api.listWallet()
        ]);
        if (active) {
          setProfile(storedProfile ? (JSON.parse(storedProfile) as SpendProfileValues) : {});
          setWallet(walletResponse.cards);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load spend profile.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const projection = useMemo(() => {
    const cards = wallet.map((walletCard) => walletCard.card);
    const monthlySpendByCategory = categories.reduce<Partial<Record<PurchaseCategory, number>>>((values, category) => {
      const monthlySpend = parseAmount(profile[category]);
      if (monthlySpend > 0) {
        values[category] = monthlySpend;
      }

      return values;
    }, {});

    return getSpendProjection({
      cards,
      categories,
      monthlySpendByCategory
    });
  }, [categories, profile, wallet]);

  const projections = projection.rows;
  const totals = projection.totals;

  async function saveProfile() {
    if (saving) return;

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
      <InfoCard tone="info">
        <View style={styles.headerRow}>
          <View style={[styles.headerIcon, { backgroundColor: themeColors.surface }]}>
            <Feather name="pie-chart" size={22} color={themeColors.primary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: themeColors.text }]}>{t("spendProfile.title")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("spendProfile.copy")}</Text>
          </View>
        </View>
      </InfoCard>

      <ErrorBanner message={error} />

      <View style={styles.inputList}>
        {categories.map((category) => (
          <View style={[styles.inputRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]} key={category}>
            <View style={[styles.categoryIcon, { backgroundColor: themeColors.infoSoft }]}>
              <CategoryVisual category={category} color={themeColors.primary} size={19} />
            </View>
            <View style={styles.inputLabelWrap}>
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>{categoryLabel(category)}</Text>
              <Text style={[styles.inputHint, { color: themeColors.muted }]}>{t("spendProfile.monthly")}</Text>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border, color: themeColors.text }]}
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
          icon="plus-circle"
        />
      ) : projections.length === 0 ? (
        <EmptyState title={t("spendProfile.empty.title")} message={t("spendProfile.empty.message")} icon="edit-3" />
      ) : (
        <>
          <InfoCard tone="success">
            <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>{t("spendProfile.projected")}</Text>
            <Text style={[styles.total, { color: themeColors.text }]}>${totals.dollars.toFixed(2)}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>
              {Math.round(totals.points).toLocaleString()} points - {Math.round(totals.miles).toLocaleString()} miles
            </Text>
          </InfoCard>

          <View style={styles.projectionList}>
            {projections.map((row) => (
              <InfoCard key={row.category}>
                <View style={styles.projectionHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: themeColors.infoSoft }]}>
                    <CategoryVisual category={row.category} color={themeColors.primary} size={19} />
                  </View>
                  <View style={styles.headerCopy}>
                    <Text style={[styles.categoryName, { color: themeColors.text }]}>{categoryLabel(row.category)}</Text>
                    <Text style={[styles.copy, { color: themeColors.muted }]}>
                      ${row.annualSpend.toLocaleString()} {t("spendProfile.annualSpend")}
                    </Text>
                  </View>
                </View>
                {row.primaryCardName ? (
                  <Text style={[styles.best, { color: themeColors.primary }]}>
                    {row.primaryCardName} - {formatRewardTotals(row.rewardTotals)}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  headerCopy: {
    flex: 1,
    gap: 4
  },
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
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
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
  projectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
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
