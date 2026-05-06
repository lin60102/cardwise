import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { storage, storageKeys } from "../services/storage";
import { type AppColors, type ThemeMode, themePalettes } from "../theme";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppColors;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    async function restoreTheme() {
      const storedMode = await storage.getItem(storageKeys.themeMode);
      if (storedMode === "light" || storedMode === "dark") {
        setModeState(storedMode);
      }
    }

    void restoreTheme();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: themePalettes[mode],
      setMode: async (nextMode) => {
        setModeState(nextMode);
        await storage.setItem(storageKeys.themeMode, nextMode);
      }
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}
