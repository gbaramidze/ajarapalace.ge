'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomGalleryModal({ images, isOpen, onClose }: RoomGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition-colors z-20"
        >
          <X size={24} />
        </button>

        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition-colors z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition-colors z-20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="relative w-full max-w-5xl h-[50vh] md:h-[80vh] px-4 md:px-24" onClick={(e) => e.stopPropagation()}>
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            src={images[currentIndex]} 
            alt={`Gallery image ${currentIndex + 1}`}
            className="w-full h-full object-contain rounded-xl"
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 font-medium tracking-widest text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
