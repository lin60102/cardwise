import { type ComponentType, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import {
  canUseNativeAds,
  getBannerAdUnitId,
  initializeAds,
  isAdMobNativeModuleLinked,
  isExpoGoRuntime
} from "../services/ads";
import { spacing } from "../theme";
import { AdPlaceholder } from "./AdPlaceholder";

type BannerAdComponentProps = {
  unitId: string;
  size: string;
  requestOptions?: {
    requestNonPersonalizedAdsOnly?: boolean;
  };
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
};
type BannerAdSizeModule = {
  ANCHORED_ADAPTIVE_BANNER: string;
};
type BannerModule = {
  BannerAd: ComponentType<BannerAdComponentProps>;
  BannerAdSize: BannerAdSizeModule;
};

const DEBUG_PREFIX = "[CardWise/AdMob]";

function debugAdMob(message: string, details?: Record<string, unknown>) {
  if (process.env.EXPO_PUBLIC_ADMOB_DEBUG === "true") {
    console.log(`${DEBUG_PREFIX} ${message}`, details ?? {});
  }
}

export function AdBanner() {
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const [bannerModule, setBannerModule] = useState<BannerModule | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  // Read once on mount. canUseNativeAds() is synchronous and stable for the
  // session: it includes the NativeModules link probe and the env kill switch.
  const nativeAdsAvailable = useMemo(() => canUseNativeAds(), []);
  const adUnitId = useMemo(() => getBannerAdUnitId(), []);

  debugAdMob("render snapshot", {
    userPlan: user?.plan ?? null,
    shouldRenderAd: user?.plan === "FREE",
    envUseTestAds: process.env.EXPO_PUBLIC_ADMOB_USE_TEST_ADS ?? null,
    envEnableNativeAds: process.env.EXPO_PUBLIC_ENABLE_NATIVE_ADS ?? null,
    isExpoGoRuntime: isExpoGoRuntime(),
    isAdMobNativeModuleLinked: isAdMobNativeModuleLinked(),
    canUseNativeAds: nativeAdsAvailable,
    adUnitId,
    bannerModuleLoaded: bannerModule !== null,
    loadFailed
  });

  useEffect(() => {
    let isMounted = true;

    if (!nativeAdsAvailable) {
      debugAdMob("skipped load: canUseNativeAds() === false");
      return undefined;
    }

    setLoadFailed(false);

    // The whole dynamic-import chain is guarded by one try/catch so any failure
    // — initialization, module evaluation, missing native binding — flips to
    // the placeholder instead of bubbling out and crashing the screen.
    async function loadBannerModule() {
      try {
        debugAdMob("initializeAds() begin");
        const isReady = await initializeAds();
        debugAdMob("initializeAds() result", { isReady });

        if (!isReady || !isMounted) {
          if (isMounted) setLoadFailed(true);
          return;
        }

        debugAdMob("dynamic import begin");
        const mobileAds = await import("react-native-google-mobile-ads");
        debugAdMob("dynamic import success", {
          hasBannerAd: Boolean(mobileAds?.BannerAd),
          hasBannerAdSize: Boolean(mobileAds?.BannerAdSize)
        });

        if (!isMounted) return;

        setBannerModule({
          BannerAd: mobileAds.BannerAd as unknown as ComponentType<BannerAdComponentProps>,
          BannerAdSize: mobileAds.BannerAdSize
        });
      } catch (error) {
        console.warn(`${DEBUG_PREFIX} dynamic import failed`, error);
        if (isMounted) setLoadFailed(true);
      }
    }

    void loadBannerModule();

    return () => {
      isMounted = false;
    };
  }, [nativeAdsAvailable]);

  if (!nativeAdsAvailable || loadFailed || !bannerModule) {
    debugAdMob("rendering placeholder", {
      reason: !nativeAdsAvailable ? "canUseNativeAds=false" : loadFailed ? "loadFailed" : "moduleNotReady"
    });
    return <AdPlaceholder />;
  }

  const { BannerAd, BannerAdSize } = bannerModule;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          debugAdMob("onAdLoaded", { adUnitId });
        }}
        onAdFailedToLoad={(error: Error) => {
          console.warn(`${DEBUG_PREFIX} onAdFailedToLoad`, { adUnitId, error });
          setLoadFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingVertical: spacing.xs
  }
});
