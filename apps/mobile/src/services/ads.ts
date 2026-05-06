import { Platform } from "react-native";

const TEST_BANNER_AD_UNIT_IDS = {
  android: "ca-app-pub-3940256099942544/6300978111",
  ios: "ca-app-pub-3940256099942544/2934735716"
};

let initializationPromise: Promise<boolean> | null = null;

export function isNativeAdRuntime() {
  return Platform.OS === "android" || Platform.OS === "ios";
}

function shouldUseTestAds() {
  return process.env.EXPO_PUBLIC_ADMOB_USE_TEST_ADS !== "false";
}

export async function initializeAds() {
  if (!isNativeAdRuntime()) {
    return false;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // AdMob needs a native development build because react-native-google-mobile-ads is not available in Expo Go.
      const mobileAds = await import("react-native-google-mobile-ads");
      await mobileAds.default().initialize();
      return true;
    } catch (error) {
      console.warn("AdMob is not available in this runtime.", error);
      return false;
    }
  })();

  return initializationPromise;
}

export function getBannerAdUnitId() {
  if (shouldUseTestAds()) {
    return Platform.OS === "ios" ? TEST_BANNER_AD_UNIT_IDS.ios : TEST_BANNER_AD_UNIT_IDS.android;
  }

  try {
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_AD_UNIT_ID ?? TEST_BANNER_AD_UNIT_IDS.ios;
    }

    return process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_AD_UNIT_ID ?? TEST_BANNER_AD_UNIT_IDS.android;
  } catch {
    return Platform.OS === "ios" ? TEST_BANNER_AD_UNIT_IDS.ios : TEST_BANNER_AD_UNIT_IDS.android;
  }
}

