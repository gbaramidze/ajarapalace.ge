'use client';

import React, { useRef, useEffect } from 'react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onCategoryClick: (id: string) => void;
}

export default function CategoryTabs({ categories, activeCategoryId, onCategoryClick }: CategoryTabsProps) {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getName = (cat: Category) => {
    if (lang === 'en' && cat.name_en) return cat.name_en;
    if (lang === 'ru' && cat.name_ru) return cat.name_ru;
    return cat.name;
  };

  useEffect(() => {
    if (scrollRef.current && activeCategoryId) {
      const activeEl = scrollRef.current.querySelector(`[data-id="${activeCategoryId}"]`) as HTMLElement;
      if (activeEl) {
        // Scroll into view centered smoothly
        const containerWidth = scrollRef.current.clientWidth;
        const scrollPosition = activeEl.offsetLeft - containerWidth / 2 + activeEl.clientWidth / 2;
        scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-14 w-full z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm flex items-center">
      <button 
        className="hidden md:flex p-2 text-muted-foreground hover:text-foreground"
        onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
      >
        <ChevronLeft size={20} />
      </button>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 py-3 px-4 md:px-0"
      >
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              data-id={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={classNames(
                'whitespace-nowrap px-4 py-2 rounded-xl font-medium text-sm transition-all',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {getName(cat)}
            </button>
          );
        })}
      </div>

      <button 
        className="hidden md:flex p-2 text-muted-foreground hover:text-foreground"
        onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
