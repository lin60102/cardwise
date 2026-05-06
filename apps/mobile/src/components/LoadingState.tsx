import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  label: {
    fontSize: 15
  }
});

