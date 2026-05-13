import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  const { colors } = useAppTheme();
  const safeStyle = [styles.safe, { backgroundColor: colors.background }];

  if (!scroll) {
    return (
      <SafeAreaView style={safeStyle} edges={["top", "bottom"]}>
        <View style={styles.shell}>
          <View style={styles.content}>{children}</View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={safeStyle} edges={["top", "bottom"]}>
      <View style={styles.shell}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
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
  }
});

