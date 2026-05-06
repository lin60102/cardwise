import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

export function LanguageToggle() {
  const { t, toggleLanguage } = useLanguage();
  const { colors } = useAppTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { borderColor: colors.border, backgroundColor: colors.surfaceAlt },
        pressed && styles.pressed
      ]}
      onPress={() => void toggleLanguage()}
    >
      <Feather name="globe" size={16} color={colors.primary} />
      <Text style={[styles.text, { color: colors.primary }]}>{t("language.switchTo")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  pressed: {
    opacity: 0.8
  },
  text: {
    fontSize: 13,
    fontWeight: "900"
  }
});

