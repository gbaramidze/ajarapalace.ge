'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import classNames from 'classnames';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const languages = [
    { code: 'ka', label: 'GE' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
  ] as const;

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex bg-secondary rounded-lg p-1 border border-border">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={classNames(
              'px-3 py-1 text-xs font-bold rounded-md transition-all',
              lang === l.code 
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Mobile Version - Dropdown */}
      <div className="md:hidden relative">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="appearance-none bg-secondary text-foreground text-sm font-bold px-3 py-2 rounded-xl outline-none border border-border pr-8 cursor-pointer"
        >
          {languages.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </>
  );
}
