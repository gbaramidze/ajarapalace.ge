'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Category, MenuItem } from '../types';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import StickyCart from './StickyCart';
import CartDrawer from './CartDrawer';
import DishDetailsModal from './DishDetailsModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { Menu, Search, ChevronLeft, ChevronRight, X, Hotel, Phone } from 'lucide-react';
import classNames from 'classnames';
import Link from 'next/link';

interface HomePageContentProps {
  categories: Category[];
}

export default function HomePageContent({ categories }: HomePageContentProps) {
  const { lang, t } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const getName = (cat: Category) => {
    if (lang === 'en' && cat.name_en) return cat.name_en;
    if (lang === 'ru' && cat.name_ru) return cat.name_ru;
    return cat.name;
  };

  const nonEmptyCategories = categories.filter(cat => cat.items?.length > 0);

  // ScrollSpy Logic
  useEffect(() => {
    const handleScroll = () => {
      if (isSearchOpen || searchQuery) return;

      const scrollPosition = window.scrollY + 100;
      
      let currentActiveId = activeCategoryId;
      
      for (const cat of nonEmptyCategories) {
        const element = sectionRefs.current[cat.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentActiveId = cat.id;
          }
        }
      }
      
      if (currentActiveId !== activeCategoryId) {
        setActiveCategoryId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nonEmptyCategories, activeCategoryId, isSearchOpen, searchQuery]);

  // Sync Tabs Scroll with Active Category
  useEffect(() => {
    if (tabsScrollRef.current && activeCategoryId && !isSearchOpen) {
      const activeEl = tabsScrollRef.current.querySelector(`[data-id="${activeCategoryId}"]`) as HTMLElement;
      if (activeEl) {
        const containerWidth = tabsScrollRef.current.clientWidth;
        const scrollPosition = activeEl.offsetLeft - containerWidth / 2 + activeEl.clientWidth / 2;
        tabsScrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [activeCategoryId, isSearchOpen]);

  const scrollToCategory = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredCategories = nonEmptyCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.name_en && item.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.name_ru && item.name_ru.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <>
      {/* Unified Top Header: Hamburger [Categories] Search */}
      <header className="sticky top-0 w-full z-40 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-full shrink-0"
          >
            <Menu size={24} />
          </button>

          {isSearchOpen ? (
            <input 
              type="text" 
              autoFocus
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-2 outline-none transition-all text-foreground text-sm"
            />
          ) : (
            <div className="flex-1 flex items-center min-w-0">
              <button 
                className="hidden md:flex p-1 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => tabsScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                ref={tabsScrollRef}
                className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2"
              >
                {nonEmptyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    data-id={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={classNames(
                      'whitespace-nowrap px-4 py-1.5 rounded-xl font-bold text-sm transition-all',
                      activeCategoryId === cat.id 
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {getName(cat)}
                  </button>
                ))}
              </div>

              <button 
                className="hidden md:flex p-1 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => tabsScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <button 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery('');
            }}
            className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-full shrink-0 transition-all"
          >
            {isSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-12 pb-32">
        {(searchQuery ? filteredCategories : nonEmptyCategories).map(cat => (
          <div 
            key={cat.id} 
            id={cat.id} 
            ref={(el) => { sectionRefs.current[cat.id] = el; }}
            className="scroll-mt-24"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">{getName(cat)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
              {cat.items.map(item => (
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  onCardClick={(dish) => setSelectedDish(dish)}
                />
              ))}
            </div>
          </div>
        ))}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No items found.
          </div>
        )}
      </main>

      <Sidebar 
        categories={nonEmptyCategories} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onCategoryClick={scrollToCategory}
      />

      <StickyCart onClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      
      <DishDetailsModal 
        item={selectedDish} 
        isOpen={!!selectedDish} 
        onClose={() => setSelectedDish(null)} 
      />
    </>
  );
}
