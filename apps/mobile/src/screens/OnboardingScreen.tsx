import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../components/Screen";
import { AppButton } from "../components/AppButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { InfoCard } from "../components/InfoCard";
import { LanguageToggle } from "../components/LanguageToggle";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { colors, spacing } from "../theme";

const features = [
  { icon: "award" as const, titleKey: "onboarding.feature1.title", copyKey: "onboarding.feature1.copy" },
  { icon: "shield" as const, titleKey: "onboarding.feature2.title", copyKey: "onboarding.feature2.copy" },
  { icon: "trending-up" as const, titleKey: "onboarding.feature3.title", copyKey: "onboarding.feature3.copy" }
];

export function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finishOnboarding() {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      await completeOnboarding();
    } catch (onboardingError) {
      setError(onboardingError instanceof Error ? onboardingError.message : "Unable to finish onboarding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <LanguageToggle />
      <View style={styles.hero}>
        <View style={[styles.mark, { backgroundColor: themeColors.primary }]}>
          <Feather name="credit-card" color={themeColors.surface} size={34} />
        </View>
        <Text style={[styles.brand, { color: themeColors.primary }]}>{t("onboarding.brand")}</Text>
        <Text style={[styles.headline, { color: themeColors.text }]}>{t("onboarding.headline")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("onboarding.copy")}</Text>
      </View>

      <Image
        source={require("../../assets/images/cardwise-onboarding-hero.png")}
        style={[styles.heroImage, { borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
        resizeMode="contain"
      />

      <ErrorBanner message={error} />

      <View style={styles.featureStack}>
        {features.map((feature) => (
          <InfoCard key={feature.titleKey}>
            <View style={styles.featureRow}>
              <Feather name={feature.icon} color={themeColors.primary} size={22} />
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: themeColors.text }]}>{t(feature.titleKey)}</Text>
                <Text style={[styles.featureCopy, { color: themeColors.muted }]}>{t(feature.copyKey)}</Text>
              </View>
            </View>
          </InfoCard>
        ))}
      </View>

      <AppButton title={t("onboarding.cta")} onPress={() => void finishOnboarding()} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  brand: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900"
  },
  headline: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  featureStack: {
    gap: spacing.sm,
    flex: 1,
    justifyContent: "center"
  },
  featureRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  featureText: {
    flex: 1,
    gap: 4
  },
  featureTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  featureCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
