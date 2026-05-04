import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

export function AppButton({ title, onPress, variant = "primary", loading, disabled, icon }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.surface : colors.primary} /> : null}
      {!loading && icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.title, variant === "primary" || variant === "danger" ? styles.lightText : styles.darkText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: "transparent"
  },
  danger: {
    backgroundColor: colors.danger
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    opacity: 0.85
  },
  title: {
    fontSize: 16,
    fontWeight: "700"
  },
  lightText: {
    color: colors.surface
  },
  darkText: {
    color: colors.primary
  },
  icon: {
    width: 20,
    alignItems: "center"
  }
});

