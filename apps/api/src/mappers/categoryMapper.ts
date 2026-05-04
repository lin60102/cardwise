import { PurchaseCategory } from "@prisma/client";
import type { PurchaseCategory as SharedPurchaseCategory } from "@cardwise/shared";

const apiToDb: Record<SharedPurchaseCategory, PurchaseCategory> = {
  Dining: PurchaseCategory.DINING,
  Groceries: PurchaseCategory.GROCERIES,
  Gas: PurchaseCategory.GAS,
  Travel: PurchaseCategory.TRAVEL,
  Flights: PurchaseCategory.FLIGHTS,
  Hotels: PurchaseCategory.HOTELS,
  Delivery: PurchaseCategory.DELIVERY,
  Amazon: PurchaseCategory.AMAZON,
  Costco: PurchaseCategory.COSTCO,
  Target: PurchaseCategory.TARGET,
  Drugstores: PurchaseCategory.DRUGSTORES,
  "Office supplies": PurchaseCategory.OFFICE_SUPPLIES,
  Shipping: PurchaseCategory.SHIPPING,
  Advertising: PurchaseCategory.ADVERTISING,
  "Phone & internet": PurchaseCategory.PHONE_INTERNET,
  "Software & cloud": PurchaseCategory.SOFTWARE_CLOUD,
  "General purchase": PurchaseCategory.GENERAL_PURCHASE
};

const dbToApi = Object.fromEntries(
  Object.entries(apiToDb).map(([key, value]) => [value, key])
) as Record<PurchaseCategory, SharedPurchaseCategory>;

export function toDbCategory(category: SharedPurchaseCategory): PurchaseCategory {
  return apiToDb[category];
}

export function toApiCategory(category: PurchaseCategory): SharedPurchaseCategory {
  return dbToApi[category];
}
