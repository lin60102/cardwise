import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import { purchasePlaceholder } from "../services/revenueCat";
import { colors, spacing } from "../theme";

const plans = [
  { id: "monthly" as const, nameKey: "paywall.monthly", price: "$2.99", noteKey: "paywall.monthlyNote" },
  { id: "yearly" as const, nameKey: "paywall.yearly", price: "$24.99", noteKey: "paywall.yearlyNote" },
  { id: "lifetime" as const, nameKey: "paywall.lifetime", price: "$59.99", noteKey: "paywall.lifetimeNote" }
];

const benefits = [
  "paywall.benefit1",
  "paywall.benefit2",
  "paywall.benefit3",
  "paywall.benefit4",
  "paywall.benefit5"
];

export function PaywallScreen({ route, navigation }: ScreenProps<"Paywall">) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | "lifetime">("yearly");
  const [message, setMessage] = useState<string | null>(route.params?.reason ?? null);
  const [loading, setLoading] = useState(false);

  async function purchase() {
    setLoading(true);
    const result = await purchasePlaceholder(selectedPlan);
    setMessage(result.success ? null : t("demo.purchaseMessage"));
    setLoading(false);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>{t("paywall.kicker")}</Text>
        <Text style={styles.title}>{t("paywall.title")}</Text>
        <Text style={styles.copy}>{t("paywall.copy")}</Text>
      </View>

      <ErrorBanner message={message} />

      <View style={styles.planList}>
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => setSelectedPlan(plan.id)}
            style={[styles.plan, selectedPlan === plan.id && styles.planActive]}
          >
            <View>
              <Text style={styles.planName}>{t(plan.nameKey)}</Text>
              <Text style={styles.planNote}>{t(plan.noteKey)}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </Pressable>
        ))}
      </View>

      <InfoCard>
        {benefits.map((benefit) => (
          <View style={styles.benefitRow} key={benefit}>
            <Feather name="check" color={colors.success} size={18} />
            <Text style={styles.benefit}>{t(benefit)}</Text>
          </View>
        ))}
      </InfoCard>

      <AppButton title={t("paywall.continue")} onPress={purchase} loading={loading} />
      <AppButton title={t("paywall.later")} variant="ghost" onPress={() => navigation.navigate("MyWallet")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  planList: {
    gap: spacing.sm
  },
  plan: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  planActive: {
    borderColor: colors.primary,
    backgroundColor: "#ECFDF3"
  },
  planName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  planNote: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3
  },
  planPrice: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900"
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  benefit: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700"
  }
});
