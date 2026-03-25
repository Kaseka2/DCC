"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "sw";

type Dictionary = Record<string, { en: string; sw: string }>;

const dictionary: Dictionary = {
  overview: { en: "Overview", sw: "Muhtasari" },
  members: { en: "Members", sw: "Washiriki" },
  donations: { en: "Donations", sw: "Michango" },
  attendance: { en: "Attendance", sw: "Mahudhurio" },
  events: { en: "Events", sw: "Matukio" },
  sermons: { en: "Sermons", sw: "Mahubiri" },
  reports: { en: "Reports", sw: "Ripoti" },
  userManagement: { en: "User Management", sw: "Usimamizi wa Watumiaji" },
  signOut: { en: "Sign out", sw: "Ondoka" },
  welcomeBack: { en: "Welcome back", sw: "Karibu tena" },
  accessLevel: { en: "Access level", sw: "Kiwango cha ruhusa" },
  dark: { en: "Dark", sw: "Giza" },
  light: { en: "Light", sw: "Mwanga" },
  language: { en: "Swahili", sw: "English" },
};

export type DictionaryKey = keyof typeof dictionary;

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: DictionaryKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_KEY = "churchcms-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return (window.localStorage.getItem(LANG_KEY) as Language | null) ?? "en";
  });

  useEffect(() => {
    document.documentElement.dataset.lang = language;
    window.localStorage.setItem(LANG_KEY, language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "sw" : "en"));
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      toggleLanguage,
      t: (key) => dictionary[key][language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }
  return context;
}
