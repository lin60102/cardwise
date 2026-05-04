export const PURCHASE_CATEGORIES = [
  "Dining",
  "Groceries",
  "Gas",
  "Travel",
  "Flights",
  "Hotels",
  "Delivery",
  "Amazon",
  "Costco",
  "Target",
  "Drugstores",
  "Office supplies",
  "Shipping",
  "Advertising",
  "Phone & internet",
  "Software & cloud",
  "General purchase"
] as const;

export type PurchaseCategory = (typeof PURCHASE_CATEGORIES)[number];

export const FREE_CARD_LIMIT = 5;
