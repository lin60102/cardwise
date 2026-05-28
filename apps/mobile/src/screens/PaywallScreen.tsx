import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { ScreenProps } from "../navigation/types";
import {
  fetchPremiumOfferings,
  purchasePremiumPlan,
  restorePremiumPurchases,
  type PremiumOfferingPlan,
  type PremiumPlanId
} from "../services/revenueCat";
import { isScreenshotMode } from "../services/screenshotMode";
import { colors, spacing } from "../theme";

const plans = [
  { id: "monthly" as const, nameKey: "paywall.monthly", price: "$2.99", noteKey: "paywall.monthlyNote" },
  { id: "yearly" as const, nameKey: "paywall.yearly", price: "$24.99", noteKey: "paywall.yearlyNote" }
];

const benefits = [
  "paywall.benefit1",
  "paywall.benefit2",
  "paywall.benefit3",
  "paywall.benefit4",
  "paywall.benefit5",
  "paywall.benefit6"
];

export function PaywallScreen({ route, navigation }: ScreenProps<"Paywall">) {
  const { t } = useLanguage();
  const { syncRevenueCatSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlanId>("yearly");
  const [offeringPlans, setOfferingPlans] = useState<PremiumOfferingPlan[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState(!isScreenshotMode);
  const [message, setMessage] = useState<string | null>(isScreenshotMode ? null : route.params?.reason ?? null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (isScreenshotMode) {
      return;
    }

    let active = true;
    mountedRef.current = true;

    async function loadOfferings() {
      if (active) {
        setOfferingsLoading(true);
      }
      const nextPlans = await fetchPremiumOfferings();
      if (active) {
        setOfferingPlans(nextPlans);
        if (nextPlans.length === 0) {
          setMessage((currentMessage) => currentMessage ?? t("demo.purchaseMessage"));
        }
        setOfferingsLoading(false);
      }
    }

    void loadOfferings();

    return () => {
      active = false;
      mountedRef.current = false;
    };
  }, [t]);

  const offeringsByPlan = useMemo(
    () => new Map(offeringPlans.map((plan) => [plan.id, plan])),
    [offeringPlans]
  );

  async function purchase() {
    if (loading || restoring) return;

    const revenueCatPlan = offeringsByPlan.get(selectedPlan);
    if (!revenueCatPlan) {
      setMessage(t("demo.purchaseMessage"));
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await purchasePremiumPlan(revenueCatPlan);
      if (!mountedRef.current) return;

      if (!result.success) {
        setMessage(result.cancelled ? null : result.message ?? t("paywall.purchaseError"));
        return;
      }

      // The backend verifies RevenueCat status before unlocking server-enforced Premium gates.
      await syncRevenueCatSubscription();
      if (!mountedRef.current) return;
      setMessage(result.isPremium ? t("paywall.purchaseSuccess") : t("paywall.syncPending"));
    } catch {
      if (mountedRef.current) {
        setMessage(t("paywall.syncError"));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }

  async function restore() {
    if (restoring || loading) return;

    setRestoring(true);
    setMessage(null);

    try {
      const result = await restorePremiumPurchases();
      if (!mountedRef.current) return;

      if (!result.success) {
        setMessage(result.message ?? t("paywall.restoreError"));
        return;
      }

      await syncRevenueCatSubscription();
      if (!mountedRef.current) return;
      setMessage(result.isPremium ? t("paywall.restoreSuccess") : t("paywall.noPurchases"));
    } catch {
      if (mountedRef.current) {
        setMessage(t("paywall.syncError"));
      }
    } finally {
      if (mountedRef.current) {
        setRestoring(false);
      }
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>{t("paywall.kicker")}</Text>
        <Text style={styles.title}>{t("paywall.title")}</Text>
        <Text style={styles.copy}>{t("paywall.copy")}</Text>
      </View>

      <Image
        source={require("../../assets/images/cardwise-paywall-premium.png")}
        style={styles.heroImage}
        resizeMode="contain"
      />

      <InfoCard tone="warm">
        <Text style={styles.valueTitle}>{t("paywall.valueTitle")}</Text>
        <Text style={styles.copy}>{t("paywall.valueCopy")}</Text>
      </InfoCard>

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
            <View style={styles.planRight}>
              <Text style={styles.planPrice}>{offeringsByPlan.get(plan.id)?.price ?? plan.price}</Text>
              {selectedPlan === plan.id ? <Feather name="check-circle" size={20} color={colors.primary} /> : null}
            </View>
          </Pressable>
        ))}
      </View>

      {offeringsLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>{t("paywall.loadingOfferings")}</Text>
        </View>
      ) : null}

      <InfoCard tone="success">
        {benefits.map((benefit) => (
          <View style={styles.benefitRow} key={benefit}>
            <Feather name="check" color={colors.success} size={18} />
            <Text style={styles.benefit}>{t(benefit)}</Text>
          </View>
        ))}
      </InfoCard>

      <AppButton
        title={t("paywall.continue")}
        onPress={purchase}
        loading={loading}
        disabled={offeringsLoading || restoring}
      />
      <AppButton
        title={t("paywall.restore")}
        variant="secondary"
        onPress={restore}
        loading={restoring}
        disabled={offeringsLoading || loading}
      />
      <AppButton title={t("paywall.later")} variant="ghost" onPress={() => navigation.navigate("MainTabs", { screen: "MyWallet" })} />
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
  valueTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  planList: {
    gap: spacing.sm
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700"
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
    backgroundColor: "#EEF2FF"
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
  planRight: {
    alignItems: "flex-end",
    gap: spacing.xs
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
