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
    icon: "./assets/images/kensa-app-icon.png",
    assetBundlePatterns: ["assets/images/*"],
    splash: {
      image: "./assets/images/kensa-splash.png",
      resizeMode: "contain",
      backgroundColor: "#F7F6F2"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kensa.cardwise",
      usesAppleSignIn: true,
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.cardwise.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/kensa-app-icon.png",
        backgroundColor: "#F7F6F2"
      }
    },
    plugins: ["expo-font", "expo-sqlite", "expo-apple-authentication", "expo-secure-store"],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://cardwise-jvec.onrender.com",
      eas: {
        projectId: "2afc3aba-4be7-4b9b-9214-69db4ae00a1b"
      }
    }
  },
  // react-native-google-mobile-ads (v13.x) does NOT ship an Expo config plugin.
  // Listing it inside expo.plugins triggers:
  //   PluginError: Unable to resolve a valid config plugin for react-native-google-mobile-ads
  // The library autolinker reads this top-level block at native build time and
  // injects GADApplicationIdentifier into Info.plist / AndroidManifest.xml.
  "react-native-google-mobile-ads": {
    android_app_id: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || TEST_ADMOB_APP_IDS.android,
    ios_app_id: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || TEST_ADMOB_APP_IDS.ios
  }
};
