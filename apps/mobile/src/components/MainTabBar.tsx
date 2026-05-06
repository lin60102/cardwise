import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, type NavigationProp } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/types";
import { spacing } from "../theme";

const MAIN_TABS: Array<{
  routeName: keyof Pick<RootStackParamList, "MyWallet" | "Recommendation" | "SpendProfile" | "BonusTracker" | "Settings">;
  labelKey: string;
  icon: keyof typeof Feather.glyphMap;
}> = [
  { routeName: "MyWallet", labelKey: "nav.wallet", icon: "credit-card" },
  { routeName: "Recommendation", labelKey: "nav.best", icon: "zap" },
  { routeName: "SpendProfile", labelKey: "nav.spend", icon: "pie-chart" },
  { routeName: "BonusTracker", labelKey: "nav.bonus", icon: "target" },
  { routeName: "Settings", labelKey: "nav.settings", icon: "settings" }
];

export function isMainTabRoute(routeName: string) {
  return MAIN_TABS.some((item) => item.routeName === routeName);
}

export function MainTabBar() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { t } = useLanguage();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.ink }]}>
        {MAIN_TABS.map((item) => {
          const active = route.name === item.routeName;
          return (
            <Pressable
              key={item.routeName}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => navigation.navigate(item.routeName)}
              style={({ pressed }) => [
                styles.item,
                active && { backgroundColor: colors.infoSoft },
                pressed && styles.pressed
              ]}
            >
              <Feather name={item.icon} size={20} color={active ? colors.primary : colors.muted} />
              <Text style={[styles.label, { color: active ? colors.primary : colors.muted }]} numberOfLines={1}>
                {t(item.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm
  },
  bar: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    minHeight: 66,
    borderRadius: 8,
    borderWidth: 1,
    padding: 5,
    flexDirection: "row",
    gap: 4,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  item: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 2
  },
  pressed: {
    opacity: 0.78
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900"
  }
});
