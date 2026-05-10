import { type ComponentType, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { canUseNativeAds, getBannerAdUnitId, initializeAds } from "../services/ads";
import { spacing } from "../theme";
import { AdPlaceholder } from "./AdPlaceholder";

type BannerAdComponentProps = {
  unitId: string;
  size: string;
  requestOptions?: {
    requestNonPersonalizedAdsOnly?: boolean;
  };
  onAdFailedToLoad?: (error: Error) => void;
};
type BannerAdSizeModule = {
  ANCHORED_ADAPTIVE_BANNER: string;
};
type BannerModule = {
  BannerAd: ComponentType<BannerAdComponentProps>;
  BannerAdSize: BannerAdSizeModule;
};

export function AdBanner() {
  const { colors } = useAppTheme();
  const [bannerModule, setBannerModule] = useState<BannerModule | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const adUnitId = useMemo(() => getBannerAdUnitId(), []);

  useEffect(() => {
    let isMounted = true;

    if (!canUseNativeAds()) {
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
            BannerAd: mobileAds.BannerAd as unknown as ComponentType<BannerAdComponentProps>,
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

  if (!canUseNativeAds() || loadFailed || !bannerModule) {
    return <AdPlaceholder />;
  }

  const { BannerAd, BannerAdSize } = bannerModule;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error: Error) => {
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
