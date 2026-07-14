'use client';

import React, { useEffect } from 'react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (id: string) => void;
}

export default function Sidebar({ categories, isOpen, onClose, onCategoryClick }: SidebarProps) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const getName = (cat: Category) => {
    if (lang === 'en' && cat.name_en) return cat.name_en;
    if (lang === 'ru' && cat.name_ru) return cat.name_ru;
    return cat.name;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.15, ease: 'circOut' }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-background z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-xl font-bold">{t.categories}</span>
              <button onClick={onClose} className="p-2 bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <h3 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t.categories}</h3>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryClick(cat.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 text-left px-4 py-3 rounded-xl hover:bg-secondary font-medium transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-secondary">
                    {cat.items[0]?.thumb && (
                      <img 
                        src={cat.items[0].thumb || undefined} 
                        alt="" 
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                  </div>
                  <span className="flex-1">{getName(cat)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
