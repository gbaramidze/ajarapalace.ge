'use client';

import React from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Home, Hotel, Map, Phone } from 'lucide-react';

export default function GlobalHeader() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <>
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/new.png" alt="Ajara Palace Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Links & Language Switcher */}
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: '/', label: t.home },
                { href: '/hotel', label: t.hotel },
                { href: '/streetview', label: t.streetview },
                { href: '/contact', label: t.contact },
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={classNames(
                    "text-sm font-bold transition-colors relative",
                    pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-3">
              <a href="tel:+995555198575" className="md:hidden flex items-center gap-1.5 text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-primary/20">
                <Phone size={14} />
                +995 555 19 85 75
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Links - App Style Bottom Navigation */}
      {totalItems === 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full border-t border-border bg-background z-40 pb-safe shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto px-2 h-16 flex items-center justify-between gap-1">
            <Link href="/" className={classNames("flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all flex-1 h-full", pathname === "/" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Home size={22} />
              <span className="text-[10px] font-bold">{t.home}</span>
            </Link>
            <Link href="/hotel" className={classNames("flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all flex-1 h-full", pathname === "/hotel" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Hotel size={22} />
              <span className="text-[10px] font-bold">{t.hotel}</span>
            </Link>
            <Link href="/streetview" className={classNames("flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all flex-1 h-full", pathname === "/streetview" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Map size={22} />
              <span className="text-[10px] font-bold">{t.streetview}</span>
            </Link>
            <Link href="/contact" className={classNames("flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all flex-1 h-full", pathname === "/contact" ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <Phone size={22} />
              <span className="text-[10px] font-bold">{t.contact}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
