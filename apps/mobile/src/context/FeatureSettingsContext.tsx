import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { storage, storageKeys } from "../services/storage";

interface FeatureSettingsContextValue {
  showBusinessCards: boolean;
  setShowBusinessCards: (enabled: boolean) => Promise<void>;
}

const FeatureSettingsContext = createContext<FeatureSettingsContextValue | undefined>(undefined);

export function FeatureSettingsProvider({ children }: { children: ReactNode }) {
  const [showBusinessCards, setShowBusinessCardsState] = useState(false);

  useEffect(() => {
    async function restore() {
      const stored = await storage.getItem(storageKeys.showBusinessCards);
      setShowBusinessCardsState(stored === "true");
    }

    void restore();
  }, []);

  const value = useMemo<FeatureSettingsContextValue>(
    () => ({
      showBusinessCards,
      setShowBusinessCards: async (enabled) => {
        setShowBusinessCardsState(enabled);
        await storage.setItem(storageKeys.showBusinessCards, String(enabled));
      }
    }),
    [showBusinessCards]
  );

  return <FeatureSettingsContext.Provider value={value}>{children}</FeatureSettingsContext.Provider>;
}

export function useFeatureSettings() {
  const context = useContext(FeatureSettingsContext);

  if (!context) {
    throw new Error("useFeatureSettings must be used within FeatureSettingsProvider");
  }

  return context;
}
