import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { PurchaseCategory } from "@cardwise/shared";

export type CategoryIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const categoryIcons: Record<PurchaseCategory, CategoryIconName> = {
  Dining: "food-takeout-box",
  Groceries: "basket",
  Gas: "gas-station",
  Travel: "map-marker-distance",
  Flights: "airplane",
  Hotels: "bed",
  Delivery: "truck-delivery",
  Amazon: "package-variant-closed",
  Costco: "store",
  Target: "target",
  Drugstores: "pill",
  "Office supplies": "briefcase",
  Shipping: "package-variant",
  Advertising: "bullhorn",
  "Phone & internet": "wifi",
  "Software & cloud": "cloud-outline",
  "General purchase": "credit-card-outline"
};

export function CategoryVisual({
  category,
  color,
  size = 22
}: {
  category: PurchaseCategory;
  color: string;
  size?: number;
}) {
  return <MaterialCommunityIcons name={categoryIcons[category]} size={size} color={color} />;
}
