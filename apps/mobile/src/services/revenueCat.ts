import { Platform } from "react-native";
import type Purchases from "react-native-purchases";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";

const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
export const premiumEntitlementId = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? "premium";

export type PremiumPlanId = "monthly" | "yearly";

export interface PremiumOfferingPlan {
  id: PremiumPlanId;
  package: PurchasesPackage;
  price: string;
  productIdentifier: string;
}

interface RevenueCatModule {
  default: typeof Purchases;
}

let purchasesModule: RevenueCatModule | null = null;
let configuredUserId: string | null = null;

function isUnavailableError(error: unknown) {
  return error instanceof Error ? error.message : "RevenueCat is not available in this runtime.";
}

async function loadPurchases() {
  if (!purchasesModule) {
    purchasesModule = await import("react-native-purchases");
  }

  return purchasesModule.default;
}

export async function configureRevenueCat(userId: string) {
  const apiKey = Platform.OS === "ios" ? iosApiKey : androidApiKey;

  if (!apiKey) {
    return { available: false, message: "Missing RevenueCat public SDK key for this platform." };
  }

  if (configuredUserId === userId) {
    return { available: true };
  }

  try {
    // Native IAP modules require an Expo development build; Expo Go cannot load react-native-purchases.
    const Purchases = await loadPurchases();
    Purchases.configure({ apiKey, appUserID: userId });
    configuredUserId = userId;
    return { available: true };
  } catch (error: unknown) {
    console.warn("RevenueCat is not available in this runtime.", error);
    return { available: false, message: isUnavailableError(error) };
  }
}

function findPackage(packages: PurchasesPackage[], planId: PremiumPlanId) {
  const expectedType = planId === "monthly" ? "MONTHLY" : "ANNUAL";
  const expectedText = planId === "monthly" ? "monthly" : "annual";
  const alternateText = planId === "monthly" ? "month" : "year";

  return (
    packages.find((item) => item.packageType === expectedType) ??
    packages.find((item) => {
      const packageId = item.identifier.toLowerCase();
      const productId = item.product.identifier.toLowerCase();
      return (
        packageId.includes(expectedText) ||
        packageId.includes(alternateText) ||
        productId.includes(expectedText) ||
        productId.includes(alternateText)
      );
    }) ??
    null
  );
}

export async function fetchPremiumOfferings(): Promise<PremiumOfferingPlan[]> {
  try {
    const Purchases = await loadPurchases();
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];
    const monthly = offerings.current?.monthly ?? findPackage(packages, "monthly");
    const yearly = offerings.current?.annual ?? findPackage(packages, "yearly");

    return [
      monthly
        ? {
            id: "monthly",
            package: monthly,
            price: monthly.product.priceString,
            productIdentifier: monthly.product.identifier
          }
        : null,
      yearly
        ? {
            id: "yearly",
            package: yearly,
            price: yearly.product.priceString,
            productIdentifier: yearly.product.identifier
          }
        : null
    ].filter((plan): plan is PremiumOfferingPlan => Boolean(plan));
  } catch (error: unknown) {
    console.warn("Unable to fetch RevenueCat offerings.", error);
    return [];
  }
}

export function hasActivePremiumEntitlement(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[premiumEntitlementId]?.isActive);
}

export async function getRevenueCatCustomerInfo() {
  const Purchases = await loadPurchases();
  return Purchases.getCustomerInfo();
}

export async function purchasePremiumPlan(plan: PremiumOfferingPlan) {
  try {
    const Purchases = await loadPurchases();
    const result = await Purchases.purchasePackage(plan.package);
    return {
      success: true,
      customerInfo: result.customerInfo,
      isPremium: hasActivePremiumEntitlement(result.customerInfo)
    };
  } catch (error: unknown) {
    const maybePurchaseError = error as { userCancelled?: boolean; message?: string };
    return {
      success: false,
      cancelled: Boolean(maybePurchaseError.userCancelled),
      message: maybePurchaseError.message ?? "Purchase failed."
    };
  }
}

export async function restorePremiumPurchases() {
  try {
    const Purchases = await loadPurchases();
    const customerInfo = await Purchases.restorePurchases();
    return {
      success: true,
      customerInfo,
      isPremium: hasActivePremiumEntitlement(customerInfo)
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: isUnavailableError(error)
    };
  }
}

export async function purchaseSupportPlaceholder(amount: number) {
  console.log(`RevenueCat support placeholder selected: $${amount.toFixed(2)}`);
  return { success: false, message: "Connect RevenueCat support products in a development build to enable one-time support." };
}

