import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { PurchaseCategory } from "@cardwise/shared";
import { categoryLabels, type Language, supportedLanguages, translations } from "../i18n/translations";
import { storage, storageKeys } from "../services/storage";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (key: string, values?: Record<string, string | number>) => string;
  categoryLabel: (category: PurchaseCategory) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function interpolate(template: string, values?: Record<string, string | number>) {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    async function restoreLanguage() {
      const storedLanguage = await storage.getItem(storageKeys.language);
      const matchedLanguage = supportedLanguages.find((item) => item.code === storedLanguage);
      if (matchedLanguage) {
        setLanguageState(matchedLanguage.code);
      }
    }

    void restoreLanguage();
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: async (nextLanguage) => {
        setLanguageState(nextLanguage);
        await storage.setItem(storageKeys.language, nextLanguage);
      },
      toggleLanguage: async () => {
        const currentIndex = supportedLanguages.findIndex((item) => item.code === language);
        const nextLanguage = supportedLanguages[(currentIndex + 1) % supportedLanguages.length].code;
        setLanguageState(nextLanguage);
        await storage.setItem(storageKeys.language, nextLanguage);
      },
      t: (key, values) => {
        const template = translations[language][key] ?? translations.en[key] ?? key;
        return interpolate(template, values);
      },
      categoryLabel: (category) => categoryLabels[language][category] ?? category
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
