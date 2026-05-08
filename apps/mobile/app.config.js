const TEST_ADMOB_APP_IDS = {
  android: "ca-app-pub-3940256099942544~3347511713",
  ios: "ca-app-pub-3940256099942544~1458002511"
};

module.exports = {
  expo: {
    name: "CardWise",
    slug: "cardwise",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "cardwise",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["assets/images/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cardwise.app"
    },
    android: {
      package: "com.cardwise.app"
    },
    plugins: ["expo-font", "expo-sqlite"],
    extra: {
      apiUrl: "http://localhost:4000"
    }
  },
  "react-native-google-mobile-ads": {
    android_app_id: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || TEST_ADMOB_APP_IDS.android,
    ios_app_id: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || TEST_ADMOB_APP_IDS.ios
  }
};
