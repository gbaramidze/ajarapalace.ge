'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Language } from '../types';
import { dictionaries } from '../dictionaries';

type Dictionary = typeof dictionaries.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLang = (params?.lang as Language) || 'ka';
  // Ensure we fallback to 'ka' if an unsupported language somehow sneaks in
  const lang = ['ka', 'en', 'ru'].includes(currentLang) ? currentLang : 'ka';

  const handleSetLang = (newLang: Language) => {
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    if (pathname) {
      const newPathname = pathname.replace(/^\/[^\/]+/, `/${newLang}`);
      router.push(newPathname);
    }
  };

  const value = {
    lang,
    setLang: handleSetLang,
    t: dictionaries[lang] || dictionaries.ka,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
