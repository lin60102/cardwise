import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

export function AdPlaceholder() {
  const { t } = useLanguage();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
      <Feather name="info" size={15} color={colors.muted} />
      <Text style={[styles.label, { color: colors.muted }]}>{t("ad.placeholder")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.xs
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  }
});
