import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

export function PlanBadge({ plan }: { plan: "FREE" | "PREMIUM" }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const isPremium = plan === "PREMIUM";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isPremium ? colors.primary : colors.successSoft,
          borderColor: isPremium ? colors.primary : colors.successSoft
        }
      ]}
    >
      <Text style={[styles.text, { color: isPremium ? colors.surface : colors.primary }]}>
        {isPremium ? t("plan.premium") : t("plan.free")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#B9E5EF"
  },
  text: {
    fontSize: 12,
    fontWeight: "800"
  }
});
