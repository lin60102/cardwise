import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";
import { isMainTabRoute, MainTabBar } from "./MainTabBar";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  const { colors } = useAppTheme();
  const route = useRoute();
  const showMainTabs = isMainTabRoute(route.name);
  const safeStyle = [styles.safe, { backgroundColor: colors.background }];
  const contentStyle = [styles.content, showMainTabs && styles.contentWithTabs];

  if (!scroll) {
    return (
      <SafeAreaView style={safeStyle} edges={["bottom"]}>
        <View style={styles.shell}>
          <View style={contentStyle}>{children}</View>
          {showMainTabs ? <MainTabBar /> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={safeStyle} edges={["bottom"]}>
      <View style={styles.shell}>
        <ScrollView contentContainerStyle={contentStyle} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {showMainTabs ? <MainTabBar /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  shell: {
    flex: 1
  },
  content: {
    width: "100%",
    maxWidth: 1040,
    alignSelf: "center",
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.md
  },
  contentWithTabs: {
    paddingBottom: spacing.sm
  }
});

