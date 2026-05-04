import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageKeys = {
  authToken: "cardwise.authToken",
  authUser: "cardwise.authUser",
  hasOnboarded: "cardwise.hasOnboarded",
  language: "cardwise.language",
  demoWallet: "cardwise.demoWallet",
  showBusinessCards: "cardwise.showBusinessCards"
};

export const storage = AsyncStorage;
