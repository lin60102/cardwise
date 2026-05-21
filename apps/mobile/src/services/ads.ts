import { NativeModules, Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

const TEST_BANNER_AD_UNIT_IDS = {
  android: "ca-app-pub-3940256099942544/6300978111",
  ios: "ca-app-pub-3940256099942544/2934735716"
};

const ADMOB_NATIVE_MODULE_NAME = "RNGoogleMobileAdsModule";

let initializationPromise: Promise<boolean> | null = null;
let nativeModuleLinkedResult: boolean | undefined;

export function isNativeAdRuntime() {
  return Platform.OS === "android" || Platform.OS === "ios";
}

export function isExpoGoRuntime() {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient && Constants.expoGoConfig !== null;
}

/**
 * Synchronous, crash-safe probe for whether RNGoogleMobileAdsModule is
 * registered in the current native binary.
 *
 * The library's JS entry calls TurboModuleRegistry.getEnforcing(...) at module
 * evaluation, which CRASHES (uncatchable on the new architecture) when the
 * matching native module is not linked — which happens in Expo Go, in dev
 * builds that haven't been rebuilt since the library was added, and on web.
 *
 * We instead read NativeModules directly. Missing modules return `undefined`,
 * never throw, on both the legacy bridge and the new TurboModule architecture.
 */
export function isAdMobNativeModuleLinked() {
  if (nativeModuleLinkedResult !== undefined) {
    return nativeModuleLinkedResult;
  }

  try {
    const modules = NativeModules as Record<string, unknown> | undefined;
    nativeModuleLinkedResult = Boolean(modules?.[ADMOB_NATIVE_MODULE_NAME]);
  } catch {
    nativeModuleLinkedResult = false;
  }

  return nativeModuleLinkedResult;
}

export function canUseNativeAds() {
  // Native ads need iOS or Android.
  if (!isNativeAdRuntime()) return false;
  // Expo Go cannot load the AdMob native module — fall back to the placeholder.
  if (isExpoGoRuntime()) return false;
  // Opt-out kill switch. Default is enabled in development builds and EAS builds
  // because AdMob env vars (App ID, banner unit ID) ship pre-configured.
  if (process.env.EXPO_PUBLIC_ENABLE_NATIVE_ADS === "false") return false;
  // Final guard: even on iOS/Android the dev build may have been compiled before
  // the library was added. Without this, dynamic-importing the JS entry would
  // trigger TurboModuleRegistry.getEnforcing and crash the app.
  if (!isAdMobNativeModuleLinked()) return false;
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

