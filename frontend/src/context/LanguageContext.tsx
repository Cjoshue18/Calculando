import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

// Bundled core translations for zero-flicker instant rendering
import esDict from '../locales/es.json';
import enDict from '../locales/en.json';

const dictionaries: Record<Language, NestedTranslations> = {
  es: esDict as unknown as NestedTranslations,
  en: enDict as unknown as NestedTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('calculando-lang') as Language;
    if (saved === 'es' || saved === 'en') return saved;
    return navigator.language.startsWith('en') ? 'en' : 'es';
  });

  useEffect(() => {
    localStorage.setItem('calculando-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: unknown = dictionaries[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to Spanish
        let fallbackCurrent: unknown = dictionaries.es;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in (fallbackCurrent as Record<string, unknown>)) {
            fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fbKey];
          } else {
            return path;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : path;
      }
    }

    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
