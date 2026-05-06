import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

export function AppButton({ title, onPress, variant = "primary", loading, disabled, icon }: AppButtonProps) {
  const { colors } = useAppTheme();
  const variantStyle = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1 },
    ghost: { backgroundColor: "transparent" },
    danger: { backgroundColor: colors.danger }
  }[variant];
  const textStyle = variant === "primary" || variant === "danger" ? { color: colors.surface } : { color: colors.primaryDark };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.surface : colors.primary} /> : null}
      {!loading && icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.title, textStyle]}>{title}</Text>
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
  disabled: {
    opacity: 0.55
  },
  pressed: {
    opacity: 0.85
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    flexShrink: 1
  },
  icon: {
    width: 20,
    alignItems: "center"
  }
});

