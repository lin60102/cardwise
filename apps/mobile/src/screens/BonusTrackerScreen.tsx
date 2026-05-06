import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import type { ScreenProps } from "../navigation/types";
import { api, type WalletCard } from "../services/api";
import { storage, storageKeys } from "../services/storage";
import { colors, spacing } from "../theme";

interface BonusTracker {
  targetSpend: string;
  currentSpend: string;
  deadline: string;
  rewardLabel: string;
}

type BonusTrackerMap = Record<string, BonusTracker>;

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getProgress(currentSpend: string, targetSpend: string) {
  const target = parseAmount(targetSpend);
  if (target <= 0) {
    return 0;
  }

  return Math.min(parseAmount(currentSpend) / target, 1);
}

export function BonusTrackerScreen({ navigation }: ScreenProps<"BonusTracker">) {
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [trackers, setTrackers] = useState<BonusTrackerMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const [walletResponse, storedTrackers] = await Promise.all([
          api.listWallet(),
          storage.getItem(storageKeys.bonusTrackers)
        ]);
        setWallet(walletResponse.cards);
        setTrackers(storedTrackers ? (JSON.parse(storedTrackers) as BonusTrackerMap) : {});
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load welcome bonus trackers.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const summary = useMemo(() => {
    return wallet.reduce(
      (result, walletCard) => {
        const tracker = trackers[walletCard.card.id];
        if (!tracker) {
          return result;
        }

        result.currentSpend += parseAmount(tracker.currentSpend);
        result.targetSpend += parseAmount(tracker.targetSpend);
        return result;
      },
      { currentSpend: 0, targetSpend: 0 }
    );
  }, [trackers, wallet]);

  function updateTracker(cardId: string, field: keyof BonusTracker, value: string) {
    setTrackers((current) => ({
      ...current,
      [cardId]: {
        ...(current[cardId] ?? {
          targetSpend: "",
          currentSpend: "",
          deadline: "",
          rewardLabel: ""
        }),
        [field]: value
      }
    }));
  }

  async function saveTrackers() {
    setSaving(true);
    setError(null);

    try {
      await storage.setItem(storageKeys.bonusTrackers, JSON.stringify(trackers));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save welcome bonus trackers.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label={t("bonus.loading")} />;
  }

  return (
    <Screen>
      <InfoCard tone="warm">
        <View style={styles.headerRow}>
          <View style={[styles.headerIcon, { backgroundColor: themeColors.surface }]}>
            <Feather name="target" size={22} color={themeColors.accent} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: themeColors.text }]}>{t("bonus.title")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("bonus.copy")}</Text>
            <Text style={[styles.total, { color: themeColors.primary }]}>
              ${summary.currentSpend.toLocaleString()} / ${summary.targetSpend.toLocaleString()}
            </Text>
          </View>
        </View>
      </InfoCard>

      <ErrorBanner message={error} />

      {wallet.length === 0 ? (
        <EmptyState
          title={t("recommend.noWallet.title")}
          message={t("wallet.noCards.message")}
          actionLabel={t("wallet.addCards")}
          onAction={() => navigation.navigate("AddCards")}
          icon="plus-circle"
        />
      ) : (
        <View style={styles.list}>
          {wallet.map((walletCard) => {
            const tracker = trackers[walletCard.card.id] ?? {
              targetSpend: "",
              currentSpend: "",
              deadline: "",
              rewardLabel: ""
            };
            const progress = getProgress(tracker.currentSpend, tracker.targetSpend);
            const remaining = Math.max(parseAmount(tracker.targetSpend) - parseAmount(tracker.currentSpend), 0);

            return (
              <InfoCard key={walletCard.id}>
                <Text style={[styles.cardName, { color: themeColors.text }]}>{walletCard.card.name}</Text>
                <View style={[styles.progressTrack, { backgroundColor: themeColors.surfaceAlt }]}>
                  <View style={[styles.progressFill, { backgroundColor: themeColors.primary, width: `${Math.round(progress * 100)}%` }]} />
                </View>
                <Text style={[styles.copy, { color: themeColors.muted }]}>
                  {Math.round(progress * 100)}% - ${remaining.toLocaleString()} {t("bonus.remaining")}
                </Text>

                <View style={styles.fieldGrid}>
                  <View style={styles.field}>
                    <Text style={[styles.label, { color: themeColors.muted }]}>{t("bonus.target")}</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border, color: themeColors.text }]}
                      keyboardType="decimal-pad"
                      value={tracker.targetSpend}
                      onChangeText={(value) => updateTracker(walletCard.card.id, "targetSpend", value)}
                      placeholder="4000"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={[styles.label, { color: themeColors.muted }]}>{t("bonus.current")}</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border, color: themeColors.text }]}
                      keyboardType="decimal-pad"
                      value={tracker.currentSpend}
                      onChangeText={(value) => updateTracker(walletCard.card.id, "currentSpend", value)}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                </View>

                <TextInput
                  style={[styles.fullInput, { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border, color: themeColors.text }]}
                  value={tracker.deadline}
                  onChangeText={(value) => updateTracker(walletCard.card.id, "deadline", value)}
                  placeholder={t("bonus.deadlinePlaceholder")}
                  placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.fullInput, { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border, color: themeColors.text }]}
                  value={tracker.rewardLabel}
                  onChangeText={(value) => updateTracker(walletCard.card.id, "rewardLabel", value)}
                  placeholder={t("bonus.rewardPlaceholder")}
                  placeholderTextColor={colors.muted}
                />
              </InfoCard>
            );
          })}
        </View>
      )}

      {wallet.length > 0 ? <AppButton title={t("bonus.save")} onPress={saveTrackers} loading={saving} /> : null}
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
  total: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "900"
  },
  list: {
    gap: spacing.sm
  },
  cardName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary
  },
  fieldGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  field: {
    flex: 1,
    gap: 6
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  input: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  fullInput: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    color: colors.text,
    fontSize: 15
  }
});
