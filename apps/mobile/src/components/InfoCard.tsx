import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

interface InfoCardProps {
  children: ReactNode;
  tone?: "default" | "warm" | "success" | "info";
  style?: StyleProp<ViewStyle>;
}

export function InfoCard({ children, tone = "default", style }: InfoCardProps) {
  const { colors } = useAppTheme();
  const toneStyle = {
    default: { backgroundColor: colors.surface, borderColor: colors.border },
    warm: { backgroundColor: colors.surfaceWarm, borderColor: colors.accentSoft },
    success: { backgroundColor: colors.successSoft, borderColor: colors.successSoft },
    info: { backgroundColor: colors.infoSoft, borderColor: colors.infoSoft }
  }[tone];

  return <View style={[styles.card, toneStyle, { shadowColor: colors.ink }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  }
});

