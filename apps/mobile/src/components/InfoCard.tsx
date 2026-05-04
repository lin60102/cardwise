import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../theme";

interface InfoCardProps {
  children: ReactNode;
}

export function InfoCard({ children }: InfoCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm
  }
});

