'use client';

import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export default function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 w-full z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Ajara<span className="text-primary">Palace</span>
          </span>
        </Link>

        <button 
          onClick={onSearchClick}
          className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-full transition-colors"
        >
          <Search size={22} />
        </button>

      </div>
    </header>
  );
}
