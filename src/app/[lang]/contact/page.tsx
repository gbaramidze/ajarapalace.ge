'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export default function ContactPage() {
  const { t, lang } = useLanguage();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ajara Palace",
    "image": "https://ajarapalace.ge/main.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pushkin st. 154B",
      "addressLocality": "Batumi",
      "postalCode": "6000",
      "addressCountry": "GE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.6405574,
      "longitude": 41.6264737
    },
    "url": "https://ajarapalace.ge/contact",
    "telephone": "+995555198575",
    "email": "info@ajarapalace.ge",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ]
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <JsonLd schema={localBusinessSchema} />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="p-2 bg-secondary rounded-full hover:bg-secondary/80">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t.contact}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'ka' ? 'დაგვიკავშირდით' : lang === 'ru' ? 'Свяжитесь с нами' : 'Get in Touch'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">{t.address}</h3>
                  <p className="text-foreground font-medium">Pushkin st. 154B<br/>Batumi, 6000, Georgia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">{t.phone}</h3>
                  <p className="text-foreground font-medium">+995 555 19 85 75</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">{t.email}</h3>
                  <p className="text-foreground font-medium">info@ajarapalace.ge<br/>reservations@ajarapalace.ge</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'ka' ? 'სამუშაო საათები' : lang === 'ru' ? 'Часы работы' : 'Working Hours'}
                  </h3>
                  <p className="text-foreground font-medium">24/7 Reception<br/>Restaurant: 08:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden h-full min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9075.706140265971!2d41.62647368321457!3d41.640557432196786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4067860de0551c39%3A0xd6b38e6c74e29a87!2sAjara%20Palace%20-%20Restaurant!5e1!3m2!1sen!2sge!4v1784027133324!5m2!1sen!2sge" 
              className="w-full h-full border-0" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
