import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background
  },
  label: {
    color: colors.muted,
    fontSize: 15
  }
});

