import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { getBannerAdUnitId, initializeAds, isNativeAdRuntime } from "../services/ads";
import { spacing } from "../theme";
import { AdPlaceholder } from "./AdPlaceholder";

type GoogleAdsModule = typeof import("react-native-google-mobile-ads");
type BannerModule = Pick<GoogleAdsModule, "BannerAd" | "BannerAdSize">;

export function AdBanner() {
  const { colors } = useAppTheme();
  const [bannerModule, setBannerModule] = useState<BannerModule | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const adUnitId = useMemo(() => getBannerAdUnitId(), []);

  useEffect(() => {
    let isMounted = true;

    if (!isNativeAdRuntime()) {
      return undefined;
    }

    setLoadFailed(false);

    void initializeAds()
      .then((isReady) => {
        if (!isReady) {
          return null;
        }

        return import("react-native-google-mobile-ads");
      })
      .then((mobileAds) => {
        if (isMounted && mobileAds) {
          setBannerModule({
            BannerAd: mobileAds.BannerAd,
            BannerAdSize: mobileAds.BannerAdSize
          });
        }
      })
      .catch((error) => {
        console.warn("Unable to render AdMob banner.", error);
        if (isMounted) {
          setLoadFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isNativeAdRuntime() || loadFailed || !bannerModule) {
    return <AdPlaceholder />;
  }

  const { BannerAd, BannerAdSize } = bannerModule;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => {
          console.warn("AdMob banner failed to load.", error);
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
