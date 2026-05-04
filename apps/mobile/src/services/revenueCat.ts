import { Platform } from "react-native";

const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export async function configureRevenueCat(userId: string) {
  const apiKey = Platform.OS === "ios" ? iosApiKey : androidApiKey;

  if (!apiKey) {
    return;
  }

  try {
    // Native IAP modules require an Expo development build; Expo Go cannot load react-native-purchases.
    const Purchases = await import("react-native-purchases");
    Purchases.default.configure({ apiKey, appUserID: userId });
  } catch (error) {
    console.warn("RevenueCat is not available in this runtime.", error);
  }
}

export async function fetchPremiumOfferings() {
  try {
    const Purchases = await import("react-native-purchases");
    return Purchases.default.getOfferings();
  } catch {
    return null;
  }
}

export async function purchasePlaceholder(plan: "monthly" | "yearly" | "lifetime") {
  console.log(`RevenueCat purchase placeholder selected: ${plan}`);
  return { success: false, message: "Connect RevenueCat offerings in a development build to enable purchases." };
}

