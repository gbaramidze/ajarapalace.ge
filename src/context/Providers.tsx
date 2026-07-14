'use client';

import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { CartProvider } from './CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </LanguageProvider>
  );
}
