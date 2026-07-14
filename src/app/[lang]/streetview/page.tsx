'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Box, X, Maximize } from 'lucide-react';
import Link from 'next/link';

export default function StreetViewPage() {
  const { t, lang } = useLanguage();
  const [activeTour, setActiveTour] = useState<string | null>(null);

  const TOUR_1 = "https://www.google.com/maps/embed?pb=!4v1784025299886!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRFV5TG5MVnc.!2m2!1d41.64016134545801!2d41.62820879659709!3f9.748486630793213!4f-12.28433198875527!5f1.2689529409645228";
  const TOUR_2 = "https://www.google.com/maps/embed?pb=!4v1784025299886!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRFV5TG5MVnc.!2m2!1d41.64016134545801!2d41.62820879659709!3f9.748486630793213!4f-12.28433198875527!5f1.2689529409645228";

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t.streetview}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1st Floor Card */}
          <div 
            onClick={() => setActiveTour(TOUR_1)}
            className="group cursor-pointer bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-64 relative"
          >
            <div className="absolute inset-0 bg-secondary group-hover:scale-105 transition-transform duration-300">
              <img src="/hotel/rooms/dining/73619092.jpg" alt="1st Floor" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Maximize size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {lang === 'ka' ? '1-ლი სართული' : lang === 'ru' ? '1 этаж' : '1st Floor'}
              </h2>
              <p className="text-white/80 font-medium mt-2">
                {lang === 'ka' ? 'რესტორანი და მისაღები' : lang === 'ru' ? 'Ресторан и лобби' : 'Restaurant & Lobby'}
              </p>
            </div>
          </div>

          {/* 2nd Floor Card */}
          <div 
            onClick={() => setActiveTour(TOUR_2)}
            className="group cursor-pointer bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-64 relative"
          >
            <div className="absolute inset-0 bg-secondary group-hover:scale-105 transition-transform duration-300">
              <img src="/hotel/rooms/facilities/76605144.jpg" alt="2nd Floor" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Maximize size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {lang === 'ka' ? 'მე-2 სართული' : lang === 'ru' ? '2 этаж' : '2nd Floor'}
              </h2>
              <p className="text-white/80 font-medium mt-2">
                {lang === 'ka' ? 'სასტუმროს ნომრები' : lang === 'ru' ? 'Гостиничные номера' : 'Hotel Rooms'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Iframe Modal */}
      {activeTour && (
        <div className="fixed inset-0 z-[100] bg-black">
          <button 
            onClick={() => setActiveTour(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur flex items-center justify-center transition-colors z-20"
          >
            <X size={24} />
          </button>
          <iframe 
            src={activeTour} 
            className="w-full h-full border-0" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      )}
    </div>
  );
}
