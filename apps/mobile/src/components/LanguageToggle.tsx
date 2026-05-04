import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing } from "../theme";

export function LanguageToggle() {
  const { t, toggleLanguage } = useLanguage();

  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={() => void toggleLanguage()}>
      <Feather name="globe" size={16} color={colors.primary} />
      <Text style={styles.text}>{t("language.switchTo")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  pressed: {
    opacity: 0.8
  },
  text: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  }
});

