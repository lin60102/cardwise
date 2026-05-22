import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { purchaseSupportPlaceholder } from "../services/revenueCat";
import { colors, spacing } from "../theme";

const PRESET_AMOUNTS = [1, 5, 10, 25, 50];

function parseCustomAmount(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function SupportScreen() {
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amount = useMemo(() => (usingCustom ? parseCustomAmount(customAmount) : selectedAmount), [
    customAmount,
    selectedAmount,
    usingCustom
  ]);

  const formattedAmount = amount > 0 ? `$${amount.toFixed(2)}` : "$0.00";

  async function supportApp() {
    if (loading) return;

    if (amount <= 0) {
      setMessage(t("support.invalidAmount"));
      return;
    }

    setLoading(true);
    try {
      const result = await purchaseSupportPlaceholder(amount);
      setMessage(result.success ? t("support.thanks") : t("support.placeholderMessage"));
    } catch (supportError) {
      setMessage(supportError instanceof Error ? supportError.message : t("support.placeholderMessage"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <InfoCard tone="warm">
        <View style={styles.heroRow}>
          <View style={[styles.heroIcon, { backgroundColor: themeColors.surface }]}>
            <Feather name="heart" size={24} color={themeColors.accent} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={[styles.kicker, { color: themeColors.accent }]}>{t("support.kicker")}</Text>
            <Text style={[styles.title, { color: themeColors.text }]}>{t("support.title")}</Text>
            <Text style={[styles.copy, { color: themeColors.muted }]}>{t("support.copy")}</Text>
          </View>
        </View>
      </InfoCard>

      <ErrorBanner message={message} />

      <InfoCard>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("support.chooseAmount")}</Text>
        <View style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amountOption) => {
            const selected = !usingCustom && selectedAmount === amountOption;
            return (
              <Pressable
                key={amountOption}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setUsingCustom(false);
                  setSelectedAmount(amountOption);
                  setMessage(null);
                }}
                style={[
                  styles.amountButton,
                  { backgroundColor: themeColors.surfaceAlt, borderColor: themeColors.border },
                  selected && { backgroundColor: themeColors.primary, borderColor: themeColors.primary }
                ]}
              >
                <Text style={[styles.amountText, { color: selected ? themeColors.surface : themeColors.primaryDark }]}>
                  ${amountOption}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: usingCustom }}
          style={[
            styles.customRow,
            { backgroundColor: usingCustom ? themeColors.infoSoft : themeColors.surfaceAlt, borderColor: themeColors.border }
          ]}
          onPress={() => setUsingCustom(true)}
        >
          <View style={styles.customLabel}>
            <Text style={[styles.optionTitle, { color: themeColors.text }]}>{t("support.customAmount")}</Text>
            <Text style={[styles.copySmall, { color: themeColors.muted }]}>{t("support.customHint")}</Text>
          </View>
          <View style={[styles.customInputWrap, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <Text style={[styles.currency, { color: themeColors.muted }]}>$</Text>
            <TextInput
              style={[styles.customInput, { color: themeColors.text }]}
              value={customAmount}
              onChangeText={(value) => {
                setUsingCustom(true);
                setCustomAmount(value);
                setMessage(null);
              }}
              keyboardType="decimal-pad"
              placeholder="12"
              placeholderTextColor={colors.muted}
            />
          </View>
        </Pressable>
      </InfoCard>

      <InfoCard tone="info">
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t("support.summaryTitle")}</Text>
        <Text style={[styles.summaryAmount, { color: themeColors.primary }]}>{formattedAmount}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("support.note")}</Text>
      </InfoCard>

      <AppButton
        title={t("support.cta", { amount: formattedAmount })}
        onPress={supportApp}
        loading={loading}
        disabled={amount <= 0}
        icon={<Feather name="heart" size={18} color={themeColors.surface} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  copySmall: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  optionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  amountButton: {
    minWidth: 92,
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  amountText: {
    fontSize: 20,
    fontWeight: "900"
  },
  customRow: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  customLabel: {
    flex: 1,
    gap: 3
  },
  customInputWrap: {
    width: 116,
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm
  },
  currency: {
    fontSize: 16,
    fontWeight: "900"
  },
  customInput: {
    flex: 1,
    minHeight: 42,
    textAlign: "right",
    fontSize: 18,
    fontWeight: "900"
  },
  summaryAmount: {
    color: colors.primary,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900"
  }
});
