import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageKeys = {
  authToken: "cardwise.authToken",
  authUser: "cardwise.authUser",
  hasOnboarded: "cardwise.hasOnboarded",
  language: "cardwise.language",
  themeMode: "cardwise.themeMode",
  demoWallet: "cardwise.demoWallet",
  showBusinessCards: "cardwise.showBusinessCards",
  spendProfile: "cardwise.spendProfile",
  bonusTrackers: "cardwise.bonusTrackers"
};

export const storage = AsyncStorage;
