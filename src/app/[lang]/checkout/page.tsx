'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { t, lang } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);

  const getName = (item: any) => {
    if (lang === 'en' && item.name_en) return item.name_en;
    if (lang === 'ru' && item.name_ru) return item.name_ru;
    return item.name;
  };

  const [orderId, setOrderId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newOrderId = Math.floor(100000 + Math.random() * 900000);

    const payload = {
      orderId: newOrderId,
      total: totalPrice.toFixed(2),
      phone: formData.get('phone'),
      street: formData.get('street'),
      building: formData.get('building'),
      floor: formData.get('floor'),
      apartment: formData.get('apartment'),
      comments: formData.get('comments'),
      cart: cart.map(c => ({ id: c.id, name: getName(c), quantity: c.quantity, price: c.price }))
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      // Even if SMS fails, we want to show success to the user so they know order is placed
      setOrderId(data.orderId || newOrderId);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card p-8 md:p-12 rounded-[2rem] border border-border text-center max-w-md w-full shadow-lg"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {lang === 'ka' ? `შეკვეთა #${orderId} გაფორმებულია` : lang === 'ru' ? `Заказ #${orderId} оформлен` : `Order #${orderId} Placed`}
          </h2>
          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            {lang === 'ka' 
              ? 'რესტორნის ადმინისტრატორი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.' 
              : lang === 'ru' 
                ? 'Администратор ресторана скоро с вами свяжется для уточнения деталей.' 
                : 'The restaurant administrator will contact you shortly to clarify the details.'}
          </p>
          <Link 
            href="/"
            onClick={() => setIsSuccess(false)}
            className="inline-block w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
          >
            {lang === 'ka' ? 'მთავარზე დაბრუნება' : lang === 'ru' ? 'Вернуться на главную' : 'Back to Home'}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag size={64} className="text-muted-foreground mb-6 opacity-30" />
        <h2 className="text-2xl font-bold mb-8 text-foreground">{t.emptyCart}</h2>
        <Link 
          href="/"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
        >
          {t.menu}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-24 md:pt-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-secondary rounded-full hover:bg-secondary/80">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t.checkout}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Order Summary */}
          <div className="lg:w-1/2 space-y-4">
            <h2 className="text-xl font-bold mb-4">{t.cart}</h2>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-2xl p-4 flex gap-4 items-center border border-border"
                >
                  <img src={item.thumb} alt={getName(item)} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight mb-2">{getName(item)}</h3>
                    <p className="text-primary font-bold">{item.price} ₾</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center bg-secondary rounded-full p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-1/2">
            <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex justify-between">
                <span>{t.total}:</span> 
                <span className="text-primary">{totalPrice.toFixed(2)} ₾</span>
              </h2>
              
              <form className="space-y-4" onSubmit={handleCheckout}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.phone}</label>
                  <input type="tel" name="phone" required className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm" placeholder="+995" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.street}</label>
                  <input type="text" name="street" required className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.building}</label>
                    <input type="text" name="building" className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm" placeholder={lang === 'ka' ? 'არასავალდებულო' : lang === 'ru' ? 'необязательно' : 'optional'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{lang === 'ka' ? 'ბინა' : lang === 'ru' ? 'Квартира' : 'Apartment'}</label>
                    <input type="text" name="apartment" className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.floor}</label>
                    <input type="text" name="floor" className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.comments}</label>
                  <textarea rows={3} name="comments" className="w-full bg-secondary border-transparent focus:border-primary rounded-xl px-4 py-3 outline-none transition-all text-foreground text-sm resize-none" placeholder="Optional..." />
                </div>
                
                <div className="pt-6 border-t border-border mt-6">
                  <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? '...' : (lang === 'ka' ? 'შეკვეთის გაფორმება' : lang === 'ru' ? 'Оформить заказ' : 'Place Order')}
                    {!isLoading && <ArrowRight size={20} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
