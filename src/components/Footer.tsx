'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Info */}
          <div className="space-y-4">
            <img src="/new.png" alt="Ajara Palace Logo" className="h-12 w-auto object-contain" />
            <p className="text-muted-foreground text-sm">
              {lang === 'ka' ? 'ისიამოვნეთ საუკეთესო ქართული სტუმართმოყვარეობით.' 
               : lang === 'ru' ? 'Наслаждайтесь лучшим грузинским гостеприимством.' 
               : 'Experience the best of Georgian hospitality.'}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">{t.categories}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">{t.home}</a></li>
              <li><a href="/reservation" className="hover:text-primary transition-colors">{t.bookTable}</a></li>
              <li><a href="/hotel" className="hover:text-primary transition-colors">{t.hotel}</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">{t.contact}</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Social</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/ajara_palace" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://facebook.com/ajarapalace.ge" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ajara Palace. All rights reserved.</p>
          <p>
            {t.poweredBy}{' '}
            <a
              href="https://restiq.ge"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              RestIQ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
