import { Platform } from "react-native";

export async function initializeAds() {
  try {
    // AdMob also needs a native development build because react-native-google-mobile-ads is not available in Expo Go.
    const mobileAds = await import("react-native-google-mobile-ads");
    await mobileAds.default().initialize();
  } catch (error) {
    console.warn("AdMob is not available in this runtime.", error);
  }
}

export function getBannerAdUnitId() {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ?? "ca-app-pub-3940256099942544/2934735716";
  }

  return process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544/6300978111";
}

