import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: "#FEE4E2",
    borderWidth: 1,
    borderColor: "#FECDCA",
    padding: spacing.md
  },
  text: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20
  }
});

