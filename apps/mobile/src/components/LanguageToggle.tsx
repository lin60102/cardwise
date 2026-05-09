import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { supportedLanguages } from "../i18n/translations";
import { spacing } from "../theme";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
      <Feather name="globe" size={16} color={colors.primary} />
      <Text style={[styles.label, { color: colors.muted }]}>{t("language.switchTo")}</Text>
      <View style={styles.options}>
        {supportedLanguages.map((item) => {
          const active = item.code === language;

          return (
            <Pressable
              key={item.code}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: active ? colors.primary : colors.surface },
                pressed && styles.pressed
              ]}
              onPress={() => void setLanguage(item.code)}
            >
              <Text style={[styles.optionText, { color: active ? colors.surface : colors.primary }]}>
                {item.shortLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    padding: 4
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    paddingLeft: spacing.xs
  },
  options: {
    flexDirection: "row",
    gap: 3
  },
  option: {
    minWidth: 38,
    minHeight: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs
  },
  pressed: {
    opacity: 0.8
  },
  optionText: {
    fontSize: 12,
    fontWeight: "900"
  }
});

