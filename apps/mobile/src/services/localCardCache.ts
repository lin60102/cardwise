import * as SQLite from "expo-sqlite";
import type { CardBenefitLike, CreditCardLike, RewardCategoryLike } from "@cardwise/shared";
import { DEMO_CARDS } from "./demoData";

const DATABASE_NAME = "cardwise.db";

type CardRow = {
  id: string;
  name: string;
  issuer: string;
  card_type: CreditCardLike["cardType"];
  annual_fee: number;
  reward_type: CreditCardLike["rewardType"];
  base_reward_rate: number;
  foreign_transaction_fee: number;
  notes: string | null;
  reward_categories_json: string;
  benefits_json: string;
  updated_at: number;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let seedPromise: Promise<void> | null = null;

function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME)
      .then(async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS credit_cards (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            issuer TEXT NOT NULL,
            card_type TEXT NOT NULL,
            annual_fee REAL NOT NULL,
            reward_type TEXT NOT NULL,
            base_reward_rate REAL NOT NULL,
            foreign_transaction_fee REAL NOT NULL,
            notes TEXT,
            reward_categories_json TEXT NOT NULL,
            benefits_json TEXT NOT NULL,
            updated_at INTEGER NOT NULL
          );

          CREATE INDEX IF NOT EXISTS credit_cards_name_idx ON credit_cards(name);
          CREATE INDEX IF NOT EXISTS credit_cards_issuer_idx ON credit_cards(issuer);
          CREATE INDEX IF NOT EXISTS credit_cards_type_idx ON credit_cards(card_type);
        `);

        return db;
      })
      .catch((error) => {
        dbPromise = null;
        throw error;
      });
  }

  return dbPromise;
}

function logCacheWarning(action: string, error: unknown) {
  console.warn(`Unable to ${action} local CardWise card cache.`, error);
}

function parseJsonArray<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function rowToCard(row: CardRow): CreditCardLike {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    cardType: row.card_type,
    annualFee: Number(row.annual_fee),
    rewardType: row.reward_type,
    baseRewardRate: Number(row.base_reward_rate),
    foreignTransactionFee: Number(row.foreign_transaction_fee),
    notes: row.notes,
    rewardCategories: parseJsonArray<RewardCategoryLike>(row.reward_categories_json, []),
    benefits: parseJsonArray<CardBenefitLike>(row.benefits_json, [])
  };
}

function fallbackSearch(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return DEMO_CARDS;
  }

  return DEMO_CARDS.filter(
    (card) =>
      card.name.toLowerCase().includes(normalizedQuery) ||
      card.issuer.toLowerCase().includes(normalizedQuery) ||
      card.notes?.toLowerCase().includes(normalizedQuery)
  );
}

async function writeCardsToCache(db: SQLite.SQLiteDatabase, cards: CreditCardLike[]) {
  const updatedAt = Date.now();

  await db.withTransactionAsync(async () => {
    for (const card of cards) {
      await db.runAsync(
        `
          INSERT OR REPLACE INTO credit_cards (
            id,
            name,
            issuer,
            card_type,
            annual_fee,
            reward_type,
            base_reward_rate,
            foreign_transaction_fee,
            notes,
            reward_categories_json,
            benefits_json,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          card.id,
          card.name,
          card.issuer,
          card.cardType,
          card.annualFee,
          card.rewardType,
          card.baseRewardRate,
          card.foreignTransactionFee,
          card.notes ?? null,
          JSON.stringify(card.rewardCategories),
          JSON.stringify(card.benefits ?? []),
          updatedAt
        ]
      );
    }
  });
}

export async function ensureLocalCardCacheSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM credit_cards");

      if ((row?.count ?? 0) === 0) {
        await writeCardsToCache(db, DEMO_CARDS);
      }
    })().catch((error) => {
      seedPromise = null;
      logCacheWarning("seed", error);
    });
  }

  return seedPromise;
}

export async function upsertCardsToLocalCache(cards: CreditCardLike[]) {
  if (cards.length === 0) {
    return;
  }

  try {
    const db = await getDatabase();
    await writeCardsToCache(db, cards);
  } catch (error) {
    logCacheWarning("update", error);
  }
}

export async function listCachedCards() {
  try {
    await ensureLocalCardCacheSeeded();
    const db = await getDatabase();
    const rows = await db.getAllAsync<CardRow>("SELECT * FROM credit_cards ORDER BY name COLLATE NOCASE ASC");
    return rows.map(rowToCard);
  } catch (error) {
    logCacheWarning("read", error);
    return DEMO_CARDS;
  }
}

export async function searchCachedCards(query: string) {
  try {
    await ensureLocalCardCacheSeeded();

    const normalizedQuery = `%${query.trim().toLowerCase()}%`;
    if (normalizedQuery === "%%") {
      return listCachedCards();
    }

    const db = await getDatabase();
    const rows = await db.getAllAsync<CardRow>(
      `
        SELECT *
        FROM credit_cards
        WHERE lower(name) LIKE ?
          OR lower(issuer) LIKE ?
          OR lower(COALESCE(notes, '')) LIKE ?
        ORDER BY name COLLATE NOCASE ASC
      `,
      [normalizedQuery, normalizedQuery, normalizedQuery]
    );

    return rows.map(rowToCard);
  } catch (error) {
    logCacheWarning("search", error);
    return fallbackSearch(query);
  }
}

export async function getCachedCard(cardId: string) {
  try {
    await ensureLocalCardCacheSeeded();
    const db = await getDatabase();
    const row = await db.getFirstAsync<CardRow>("SELECT * FROM credit_cards WHERE id = ?", [cardId]);
    return row ? rowToCard(row) : null;
  } catch (error) {
    logCacheWarning("read", error);
    return DEMO_CARDS.find((card) => card.id === cardId) ?? null;
  }
}

export async function getCachedCardsByIds(cardIds: string[]) {
  if (cardIds.length === 0) {
    return [];
  }

  try {
    await ensureLocalCardCacheSeeded();
    const db = await getDatabase();
    const placeholders = cardIds.map(() => "?").join(", ");
    const rows = await db.getAllAsync<CardRow>(`SELECT * FROM credit_cards WHERE id IN (${placeholders})`, cardIds);
    const cardsById = new Map(rows.map((row) => [row.id, rowToCard(row)]));

    return cardIds.map((cardId) => cardsById.get(cardId)).filter((card): card is CreditCardLike => Boolean(card));
  } catch (error) {
    logCacheWarning("read wallet cards from", error);
    return cardIds
      .map((cardId) => DEMO_CARDS.find((card) => card.id === cardId))
      .filter((card): card is CreditCardLike => Boolean(card));
  }
}
