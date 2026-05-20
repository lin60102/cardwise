import AsyncStorage from "@react-native-async-storage/async-storage";
import type * as SecureStore from "expo-secure-store";

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

let secureStoreAvailable: boolean | undefined;
let secureStoreModule: typeof SecureStore | null | undefined;

async function getSecureStore() {
  if (secureStoreModule !== undefined) {
    return secureStoreModule;
  }

  try {
    secureStoreModule = await import("expo-secure-store");
  } catch (error) {
    console.warn("SecureStore is not available in this runtime. Falling back to AsyncStorage.", error);
    secureStoreModule = null;
  }

  return secureStoreModule;
}

async function canUseSecureStore() {
  if (secureStoreAvailable !== undefined) {
    return secureStoreAvailable;
  }

  try {
    const SecureStore = await getSecureStore();
    if (!SecureStore) {
      secureStoreAvailable = false;
      return secureStoreAvailable;
    }

    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }

  return secureStoreAvailable;
}

async function getAuthToken() {
  if (!(await canUseSecureStore())) {
    return AsyncStorage.getItem(storageKeys.authToken);
  }

  const SecureStore = await getSecureStore();
  if (!SecureStore) {
    return AsyncStorage.getItem(storageKeys.authToken);
  }

  const secureToken = await SecureStore.getItemAsync(storageKeys.authToken);
  if (secureToken) {
    return secureToken;
  }

  const legacyToken = await AsyncStorage.getItem(storageKeys.authToken);
  if (legacyToken) {
    await SecureStore.setItemAsync(storageKeys.authToken, legacyToken);
    await AsyncStorage.removeItem(storageKeys.authToken);
  }

  return legacyToken;
}

async function setAuthToken(value: string) {
  if (await canUseSecureStore()) {
    const SecureStore = await getSecureStore();
    if (!SecureStore) {
      await AsyncStorage.setItem(storageKeys.authToken, value);
      return;
    }

    await SecureStore.setItemAsync(storageKeys.authToken, value);
    await AsyncStorage.removeItem(storageKeys.authToken);
    return;
  }

  await AsyncStorage.setItem(storageKeys.authToken, value);
}

async function removeAuthToken() {
  if (await canUseSecureStore()) {
    const SecureStore = await getSecureStore();
    await SecureStore?.deleteItemAsync(storageKeys.authToken);
  }

  await AsyncStorage.removeItem(storageKeys.authToken);
}

export const storage = {
  getItem: async (key: string) => {
    if (key === storageKeys.authToken) {
      return getAuthToken();
    }

    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (key === storageKeys.authToken) {
      await setAuthToken(value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (key === storageKeys.authToken) {
      await removeAuthToken();
      return;
    }

    await AsyncStorage.removeItem(key);
  }
};
