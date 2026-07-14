'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Wifi, Coffee, Car, Wind, MapPin, Check, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import RoomGalleryModal from '@/components/RoomGalleryModal';
import JsonLd from '@/components/JsonLd';

const COMMON_PHOTOS = [
  '/hotel/rooms/facilities/74474760.jpg',
  '/hotel/rooms/facilities/74901390.jpg',
  '/hotel/rooms/facilities/76605144.jpg',
  '/hotel/rooms/facilities/76605148.jpg',
  '/hotel/rooms/facilities/76615850.jpg',
  '/hotel/rooms/dining/73619092.jpg',
  '/hotel/rooms/dining/73619095.jpg',
];

const ROOMS = [
  {
    id: 'double',
    name: 'Double or Twin Room with Balcony',
    size: '40 m² / 431 ft²',
    beds: '2 single beds',
    view: 'Mountain view',
    images: [
      '/hotel/rooms/double/74474760.jpg',
      '/hotel/rooms/double/74475029.jpg',
      '/hotel/rooms/double/74475033.jpg',
      '/hotel/rooms/double/76603100.jpg',
      '/hotel/rooms/double/76603102.jpg',
      '/hotel/rooms/double/76603104.jpg',
      '/hotel/rooms/double/76603106.jpg',
      '/hotel/rooms/double/76603107.jpg',
      '/hotel/rooms/double/76603108.jpg',
      ...COMMON_PHOTOS
    ],
    features: [
      'Balcony/terrace', 'Bathtub', 'Private bathroom', 'Air conditioning',
      'Refrigerator', 'Soundproofing', 'Executive lounge access', 'Dressing room',
      'Extra long bed', 'Sleep comfort items', 'Walk-in shower', 'Flat-screen TV'
    ],
  },
  {
    id: 'family',
    name: 'Family Room with Bathroom',
    size: '42 m² / 452 ft²',
    beds: '1 single bed and 1 queen bed',
    view: 'Mountain view',
    images: [
      '/hotel/rooms/family/74859724.jpg',
      '/hotel/rooms/family/74901389.jpg',
      '/hotel/rooms/family/74901390.jpg',
      '/hotel/rooms/family/74901392.jpg',
      '/hotel/rooms/family/76604601.jpg',
      '/hotel/rooms/family/76604604.jpg',
      '/hotel/rooms/family/76604605.jpg',
      ...COMMON_PHOTOS
    ],
    features: [
      'Bathtub', 'Private bathroom', 'Air conditioning', 'Refrigerator',
      'Executive lounge access', 'Dressing room', 'Hair dryer', 'Extra long bed',
      'Sleep comfort items', 'Walk-in shower', 'Flat-screen TV', 'Separate dining area'
    ],
  },
  {
    id: 'triple',
    name: 'Triple Room',
    size: '45 m² / 484 ft²',
    beds: '3 single beds',
    view: 'Mountain view',
    images: [
      '/hotel/rooms/triple/74859725.jpg',
      '/hotel/rooms/triple/74859726.jpg',
      '/hotel/rooms/triple/76604394.jpg',
      '/hotel/rooms/triple/76604398.jpg',
      '/hotel/rooms/triple/76604399.jpg',
      '/hotel/rooms/triple/76604401.jpg',
      ...COMMON_PHOTOS
    ],
    features: [
      'Bathtub', 'Private bathroom', 'Air conditioning', 'Refrigerator',
      'Executive lounge access', 'Dressing room', 'Hair dryer', 'Extra long bed',
      'Sleep comfort items', 'Walk-in shower', 'Flat-screen TV', 'Separate dining area'
    ],
  },
  {
    id: 'junior',
    name: 'Junior Suite',
    size: '55 m² / 592 ft²',
    beds: '1 sofa bed / 1 king bed',
    view: 'Mountain view',
    images: [
      '/hotel/rooms/junior/75669966.jpg',
      '/hotel/rooms/junior/76603726.jpg',
      '/hotel/rooms/junior/76603729.jpg',
      '/hotel/rooms/junior/76603730.jpg',
      '/hotel/rooms/junior/76603734.jpg',
      '/hotel/rooms/junior/76603735.jpg',
      '/hotel/rooms/junior/76603736.jpg',
      '/hotel/rooms/junior/76603737.jpg',
      ...COMMON_PHOTOS
    ],
    features: [
      'Balcony/terrace', 'Bathtub', 'Private bathroom', 'Air conditioning',
      'Refrigerator', 'Seating area', 'Sofa', 'Executive lounge access',
      'Dressing room', 'Extra long bed', 'Sleep comfort items', 'Flat-screen TV'
    ],
  }
];

export default function HotelPage() {
  const { t } = useLanguage();
  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);

  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Ajara Palace Hotel",
    "image": "https://ajarapalace.ge/main.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pushkin st. 154B",
      "addressLocality": "Batumi",
      "postalCode": "6000",
      "addressCountry": "GE"
    },
    "telephone": "+995555198575",
    "url": "https://ajarapalace.ge/hotel",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": "True" },
      { "@type": "LocationFeatureSpecification", "name": "Breakfast", "value": "True" },
      { "@type": "LocationFeatureSpecification", "name": "Parking", "value": "True" },
      { "@type": "LocationFeatureSpecification", "name": "A/C Rooms", "value": "True" }
    ]
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <JsonLd schema={hotelSchema} />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{t.hotel}</h1>
          <Link href="/" className="px-6 py-2 bg-secondary rounded-full font-bold text-sm hover:bg-secondary/80">
            {t.home}
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden mb-12 shadow-sm">
          <img 
            src="/main.png" 
            alt="Hotel Lobby"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Features & Amenities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-card p-6 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-3 border border-border">
            <Wifi size={24} className="text-primary" />
            <span className="font-bold text-sm">Free WiFi</span>
          </div>
          <div className="bg-card p-6 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-3 border border-border">
            <Coffee size={24} className="text-primary" />
            <span className="font-bold text-sm">Breakfast</span>
          </div>
          <div className="bg-card p-6 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-3 border border-border">
            <Car size={24} className="text-primary" />
            <span className="font-bold text-sm">Parking</span>
          </div>
          <div className="bg-card p-6 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-3 border border-border">
            <Wind size={24} className="text-primary" />
            <span className="font-bold text-sm">A/C Rooms</span>
          </div>
        </div>

        {/* Room Types */}
        <div className="space-y-8 mb-16">
          {ROOMS.map((room) => (
            <div key={room.id} className="bg-card rounded-[2rem] border border-border overflow-hidden flex flex-col md:flex-row shadow-sm">
              
              {/* Image Section */}
              <div 
                className="md:w-1/3 h-64 md:h-auto relative overflow-hidden group cursor-pointer"
                onClick={() => setSelectedGallery(room.images)}
              >
                <img 
                  src={room.images[0]} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm">
                  <ImageIcon size={14} />
                  {room.images.length} Photos
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                      <span>{room.size}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{room.beds}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{room.view}</span>
                    </div>
                  </div>
                  <a 
                    href="https://www.booking.com/hotel/ge/ajara-palace.en-gb.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shrink-0 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity active:scale-[0.98] text-center"
                  >
                    {t.bookNow}
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 mt-auto">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-green-500 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <RoomGalleryModal 
        images={selectedGallery} 
        isOpen={selectedGallery.length > 0} 
        onClose={() => setSelectedGallery([])} 
      />
    </div>
  );
}
