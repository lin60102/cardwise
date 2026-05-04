import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing } from "../theme";

export function AdPlaceholder() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("ad.placeholder")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  }
});
