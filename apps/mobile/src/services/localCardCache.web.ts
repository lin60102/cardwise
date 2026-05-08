import type { CreditCardLike } from "@cardwise/shared";
import { DEMO_CARDS } from "./demoData";

let webCards = [...DEMO_CARDS];

function sortCards(cards: CreditCardLike[]) {
  return [...cards].sort((firstCard, secondCard) => firstCard.name.localeCompare(secondCard.name));
}

function searchCards(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return sortCards(webCards);
  }

  return sortCards(
    webCards.filter(
      (card) =>
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.issuer.toLowerCase().includes(normalizedQuery) ||
        card.notes?.toLowerCase().includes(normalizedQuery)
    )
  );
}

export async function ensureLocalCardCacheSeeded() {
  webCards = webCards.length > 0 ? webCards : [...DEMO_CARDS];
}

export async function upsertCardsToLocalCache(cards: CreditCardLike[]) {
  const cardsById = new Map(webCards.map((card) => [card.id, card]));

  for (const card of cards) {
    cardsById.set(card.id, card);
  }

  webCards = [...cardsById.values()];
}

export async function listCachedCards() {
  await ensureLocalCardCacheSeeded();
  return sortCards(webCards);
}

export async function searchCachedCards(query: string) {
  await ensureLocalCardCacheSeeded();
  return searchCards(query);
}

export async function getCachedCard(cardId: string) {
  await ensureLocalCardCacheSeeded();
  return webCards.find((card) => card.id === cardId) ?? null;
}

export async function getCachedCardsByIds(cardIds: string[]) {
  await ensureLocalCardCacheSeeded();

  return cardIds
    .map((cardId) => webCards.find((card) => card.id === cardId))
    .filter((card): card is CreditCardLike => Boolean(card));
}
