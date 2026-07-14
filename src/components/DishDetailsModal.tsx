'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';

interface DishDetailsModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishDetailsModal({ item, isOpen, onClose }: DishDetailsModalProps) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!item) return null;

  const getName = () => {
    if (lang === 'en' && item.name_en) return item.name_en;
    if (lang === 'ru' && item.name_ru) return item.name_ru;
    return item.name;
  };

  const handleAdd = () => {
    addToCart(item, quantity);
    onClose();
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
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-[60] pointer-events-none flex flex-col md:items-center md:justify-center justify-end">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-full md:w-[500px] md:h-auto md:max-h-[85vh] bg-background md:rounded-[2rem] rounded-t-[2rem] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="w-full flex justify-center py-3 md:hidden absolute top-0 z-10">
                <div className="w-12 h-1.5 bg-border rounded-full" />
              </div>
              
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-secondary transition-colors z-20 shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="relative h-64 w-full bg-secondary shrink-0">
                <img 
                  src={item.thumb || undefined} 
                  alt={getName()} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-2xl font-bold text-foreground leading-tight">
                    {getName()}
                  </h2>
                  <span className="text-2xl font-bold text-primary whitespace-nowrap">
                    {item.price} ₾
                  </span>
                </div>

                {/* You can add description here if it exists in the API later */}
                
              </div>

              <div className="p-6 md:p-8 border-t border-border bg-background shrink-0 flex items-center justify-between gap-4">
                <div className="flex items-center bg-secondary rounded-full p-1 border border-border">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button 
                  onClick={handleAdd}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShoppingCart size={20} />
                  {t.addToCart}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
