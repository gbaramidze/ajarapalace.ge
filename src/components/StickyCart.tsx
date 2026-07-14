'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyCartProps {
  onClick: () => void;
}

export default function StickyCart({ onClick }: StickyCartProps) {
  const { totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 z-40"
        >
          <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl flex items-center justify-between transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 font-bold text-lg">
              <span>{totalPrice.toFixed(2)} ₾</span>
              <ChevronRight size={20} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
