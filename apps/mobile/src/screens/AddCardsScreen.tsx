import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CardType, CreditCardLike } from "@cardwise/shared";
import { ApiError, api } from "../services/api";
import type { ScreenProps } from "../navigation/types";
import { AppButton } from "../components/AppButton";
import { CardTile } from "../components/CardTile";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingState } from "../components/LoadingState";
import { Screen } from "../components/Screen";
import { colors, spacing } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useFeatureSettings } from "../context/FeatureSettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/ThemeContext";

export function AddCardsScreen({ navigation }: ScreenProps<"AddCards">) {
  const { t } = useLanguage();
  const { colors: themeColors } = useAppTheme();
  const { user } = useAuth();
  const { showBusinessCards, setShowBusinessCards } = useFeatureSettings();
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<CreditCardLike[]>([]);
  const [filter, setFilter] = useState<CardType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [addingCardId, setAddingCardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      async function search() {
        setError(null);
        setLoading(true);
        try {
          const response = query.trim() ? await api.searchCards(query.trim()) : await api.listCards();
          setCards(response.cards);
        } catch (searchError) {
          setError(searchError instanceof Error ? searchError.message : "Unable to search cards.");
        } finally {
          setLoading(false);
        }
      }

      void search();
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!showBusinessCards && filter === "business") {
      setFilter("all");
    }
  }, [filter, showBusinessCards]);

  async function addCard(cardId: string) {
    setError(null);
    setAddingCardId(cardId);

    try {
      await api.addWalletCard(cardId);
      navigation.navigate("MyWallet");
    } catch (addError) {
      if (addError instanceof ApiError && addError.code === "FREE_CARD_LIMIT_REACHED") {
        navigation.navigate("Paywall", { reason: t("demo.errorLimit") });
      } else if (addError instanceof ApiError && addError.code === "BUSINESS_CARDS_PREMIUM_REQUIRED") {
        navigation.navigate("Paywall", { reason: t("demo.errorBusiness") });
      } else {
        setError(addError instanceof Error ? addError.message : "Unable to add card.");
      }
    } finally {
      setAddingCardId(null);
    }
  }

  async function selectFilter(nextFilter: CardType | "all") {
    if (nextFilter === "business" && user?.plan !== "PREMIUM") {
      navigation.navigate("Paywall", { reason: t("settings.businessCardsPremium") });
      return;
    }

    if (nextFilter === "business" && !showBusinessCards) {
      await setShowBusinessCards(true);
    }

    setFilter(nextFilter);
  }

  const visibleCards = cards.filter((card) => {
    if (!showBusinessCards && card.cardType === "business") {
      return false;
    }

    return filter === "all" || card.cardType === filter;
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>{t("add.title")}</Text>
        <Text style={[styles.copy, { color: themeColors.muted }]}>{t("add.copy")}</Text>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Feather name="search" color={themeColors.muted} size={20} />
        <TextInput
          style={[styles.searchInput, { color: themeColors.text }]}
          placeholder={t("add.search")}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.segment, { backgroundColor: themeColors.surfaceAlt }]}>
        {(["all", "personal", "business"] as const).map((item) => (
          <Pressable
            key={item}
            style={[styles.segmentButton, filter === item && { backgroundColor: themeColors.surface }]}
            onPress={() => void selectFilter(item)}
          >
            <Text style={[styles.segmentText, { color: filter === item ? themeColors.primary : themeColors.muted }]}>
              {item === "business" && user?.plan !== "PREMIUM"
                ? `${t(`cardType.${item}`)} Premium`
                : item === "all"
                  ? t("common.all")
                  : t(`cardType.${item}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultHeader}>
        <Text style={[styles.resultCount, { color: themeColors.muted }]}>{t("add.results", { count: visibleCards.length })}</Text>
      </View>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingState label={t("add.searching")} />
      ) : visibleCards.length === 0 ? (
        <EmptyState title={t("add.noCards.title")} message={t("add.noCards.message")} icon="search" />
      ) : (
        <View style={styles.list}>
          {visibleCards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              onPress={() => navigation.navigate("CardDetail", { cardId: card.id })}
              trailing={
                <Pressable
                  style={[styles.addButton, { backgroundColor: themeColors.primary }]}
                  onPress={() => void addCard(card.id)}
                  disabled={addingCardId === card.id}
                >
                  <Text style={[styles.addText, { color: themeColors.surface }]}>{addingCardId === card.id ? "..." : t("common.add")}</Text>
                </Pressable>
              }
            />
          ))}
        </View>
      )}

      <AppButton title={t("common.backToWallet")} variant="ghost" onPress={() => navigation.navigate("MyWallet")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  searchWrap: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16
  },
  segment: {
    backgroundColor: colors.surfaceAlt,
    padding: 4,
    borderRadius: 8,
    flexDirection: "row"
  },
  segmentButton: {
    flex: 1,
    borderRadius: 7,
    paddingVertical: spacing.sm,
    alignItems: "center"
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "800"
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  resultCount: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  list: {
    gap: spacing.sm
  },
  addButton: {
    minWidth: 58,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  addText: {
    color: colors.surface,
    fontWeight: "900"
  }
});
