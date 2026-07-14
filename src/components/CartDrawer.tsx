'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { lang, t } = useLanguage();
  const router = useRouter();

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const getName = (item: any) => {
    if (lang === 'en' && item.name_en) return item.name_en;
    if (lang === 'ru' && item.name_ru) return item.name_ru;
    return item.name;
  };

  const handleCheckout = () => {
    onClose();
    router.push(`/${lang}/checkout`);
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-0 left-0 w-full md:w-[400px] md:left-auto md:right-0 md:h-full md:rounded-l-[2rem] md:rounded-tr-none md:bottom-auto bg-background rounded-t-[2rem] z-50 flex flex-col max-h-[90vh] md:max-h-screen"
          >
            <div className="w-full flex justify-center py-3 md:hidden">
              <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>

            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.cart}</h2>
              <button onClick={onClose} className="p-2 bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-12">
                  <span className="mb-4 text-4xl">🛒</span>
                  <p className="font-medium text-lg">{t.emptyCart}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-secondary/50 rounded-2xl border border-border/50">
                    <img src={item.thumb || undefined} alt={getName(item)} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm leading-tight line-clamp-2">{getName(item)}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">{item.price} ₾</span>
                        <div className="flex items-center bg-background rounded-full p-1 border border-border">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary">
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-background">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg text-muted-foreground">{t.total}</span>
                  <span className="text-2xl font-bold">{totalPrice.toFixed(2)} ₾</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t.checkout}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
