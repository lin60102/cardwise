import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CreditCardLike } from "@cardwise/shared";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing } from "../theme";

interface CardTileProps {
  card: CreditCardLike;
  onPress?: () => void;
  trailing?: ReactNode;
}

export function CardTile({ card, onPress, trailing }: CardTileProps) {
  const { t } = useLanguage();
  const content = (
    <>
      <View style={styles.logo}>
        <Feather name="credit-card" size={22} color={colors.surface} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.meta}>
          {card.issuer} • {t(`cardType.${card.cardType}`)} • {card.rewardType} • ${card.annualFee}/yr
        </Text>
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  pressed: {
    opacity: 0.82
  },
  logo: {
    width: 44,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  body: {
    flex: 1,
    gap: 3
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    textTransform: "capitalize"
  }
});
