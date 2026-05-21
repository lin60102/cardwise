import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

const TEST_BANNER_AD_UNIT_IDS = {
  android: "ca-app-pub-3940256099942544/6300978111",
  ios: "ca-app-pub-3940256099942544/2934735716"
};

let initializationPromise: Promise<boolean> | null = null;

export function isNativeAdRuntime() {
  return Platform.OS === "android" || Platform.OS === "ios";
}

function isExpoGoRuntime() {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient && Constants.expoGoConfig !== null;
}

export function canUseNativeAds() {
  // Native ads need iOS or Android.
  if (!isNativeAdRuntime()) return false;
  // Expo Go cannot load the AdMob native module — fall back to the placeholder.
  if (isExpoGoRuntime()) return false;
  // Opt-out kill switch. Default is enabled in development builds and EAS builds
  // because AdMob env vars (App ID, banner unit ID) ship pre-configured.
  if (process.env.EXPO_PUBLIC_ENABLE_NATIVE_ADS === "false") return false;
  return true;
}

function shouldUseTestAds() {
  return process.env.EXPO_PUBLIC_ADMOB_USE_TEST_ADS !== "false";
}

export async function initializeAds() {
  if (!canUseNativeAds()) {
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

