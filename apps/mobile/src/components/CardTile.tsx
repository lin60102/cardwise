import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CreditCardLike } from "@cardwise/shared";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";

interface CardTileProps {
  card: CreditCardLike;
  onPress?: () => void;
  trailing?: ReactNode;
}

function formatRate(rate: number, rewardType: CreditCardLike["rewardType"]) {
  const value = Number.isInteger(rate) ? String(rate) : rate.toFixed(1);
  return rewardType === "cashback" ? `${value}%` : `${value}x`;
}

export function CardTile({ card, onPress, trailing }: CardTileProps) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const strongestRate = Math.max(card.baseRewardRate, ...card.rewardCategories.map((reward) => reward.rate));

  const content = (
    <>
      <View style={[styles.logo, { backgroundColor: colors.primaryDark }]}>
        <Feather name="credit-card" size={22} color={colors.surface} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {card.name}
          </Text>
          <View style={[styles.feeBadge, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.feeText, { color: colors.primaryDark }]}>${card.annualFee}/yr</Text>
          </View>
        </View>
        <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>
          {card.issuer} • {t(`cardType.${card.cardType}`)}
        </Text>
        <View style={styles.rewardRow}>
          <Text style={[styles.rewardText, { color: colors.primary, backgroundColor: colors.successSoft }]}>
            {t("card.topEarn", { rate: formatRate(strongestRate, card.rewardType) })}
          </Text>
          <Text style={[styles.baseText, { color: colors.muted, backgroundColor: colors.surfaceAlt }]}>
            {t("card.baseEarn", { rate: formatRate(card.baseRewardRate, card.rewardType) })}
          </Text>
        </View>
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.ink }]}>{content}</View>;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.ink },
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1
  },
  pressed: {
    opacity: 0.82
  },
  logo: {
    width: 44,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  body: {
    flex: 1,
    gap: 7
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm
  },
  name: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900"
  },
  meta: {
    fontSize: 13,
    fontWeight: "700"
  },
  feeBadge: {
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    backgroundColor: "#FFFFFF"
  },
  feeText: {
    fontSize: 12,
    fontWeight: "900"
  },
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  rewardText: {
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "900"
  },
  baseText: {
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "800"
  },
  trailing: {
    paddingTop: 2
  }
});
