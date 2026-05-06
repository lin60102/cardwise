import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";
import { AppButton } from "./AppButton";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ComponentProps<typeof Feather>["name"];
}

export function EmptyState({ title, message, actionLabel, onAction, icon = "credit-card" }: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
        <Feather name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
      {actionLabel && onAction ? <AppButton title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: 8,
    borderWidth: 1
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center"
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  }
});

