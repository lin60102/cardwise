import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

export function ErrorBanner({ message }: { message?: string | null }) {
  const { colors, mode } = useAppTheme();

  if (!message) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: mode === "dark" ? "#3A1F1D" : "#FEE4E2",
          borderColor: mode === "dark" ? "#6E332D" : "#FECDCA"
        }
      ]}
    >
      <Feather name="alert-circle" size={18} color={colors.danger} />
      <Text style={[styles.text, { color: colors.danger }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start"
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  }
});

