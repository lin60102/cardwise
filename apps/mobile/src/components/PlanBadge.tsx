import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing } from "../theme";

export function PlanBadge({ plan }: { plan: "FREE" | "PREMIUM" }) {
  const { t } = useLanguage();
  const isPremium = plan === "PREMIUM";

  return (
    <View style={[styles.badge, isPremium && styles.premium]}>
      <Text style={[styles.text, isPremium && styles.premiumText]}>
        {isPremium ? t("plan.premium") : t("plan.free")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.surfaceAlt
  },
  premium: {
    backgroundColor: colors.primary
  },
  text: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  premiumText: {
    color: colors.surface
  }
});
