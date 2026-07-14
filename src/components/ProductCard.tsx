'use client';

import React from 'react';
import { MenuItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onCardClick: (item: MenuItem) => void;
}

export default function ProductCard({ item, onCardClick }: ProductCardProps) {
  const { lang } = useLanguage();
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(i => i.id === item.id);

  const [isLoaded, setIsLoaded] = React.useState(false);

  const getName = () => {
    if (lang === 'en' && item.name_en) return item.name_en;
    if (lang === 'ru' && item.name_ru) return item.name_ru;
    return item.name;
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the Add button
    addToCart(item);
  };

  return (
    <div 
      onClick={() => onCardClick(item)}
      className="bg-card rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col h-full group cursor-pointer"
    >
      <div className="relative h-32 sm:h-48 overflow-hidden bg-secondary">
        <img 
          src={item.thumb || undefined} 
          alt={getName()} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-xs md:text-base text-foreground mb-3 md:mb-4 line-clamp-2">
          {getName()}
        </h3>
        <div className="mt-auto">
          {cartItem ? (
            <div className="w-full bg-primary text-primary-foreground font-bold p-1 rounded-xl text-sm flex items-center justify-between transition-colors shadow-sm">
              <button 
                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, cartItem.quantity - 1); }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/20 active:scale-95 transition-all"
              >
                <Minus size={16} />
              </button>
              <div className="flex items-center gap-1 font-bold">
                <span>{cartItem.quantity}x</span>
                <span>{(parseFloat(item.price) * cartItem.quantity).toFixed(2)} ₾</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, cartItem.quantity + 1); }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/20 active:scale-95 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <span>{parseFloat(item.price).toFixed(2)} ₾</span>
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
