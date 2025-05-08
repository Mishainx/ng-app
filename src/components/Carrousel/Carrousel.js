'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const CTA_COLORS = {
  red: 'bg-red-500 hover:bg-red-700',
  blue: 'bg-blue-500 hover:bg-blue-700',
  green: 'bg-green-500 hover:bg-green-700',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  gray: 'bg-gray-500 hover:bg-gray-700',
  black: 'bg-black hover:bg-gray-900',
  white: 'bg-white text-black border hover:bg-gray-100',
};

export default function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (deltaX > 50) {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (deltaX < -50) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
      touchStartX.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const positionClasses = {
    left: 'sm:items-center sm:justify-start sm:px-10 md:px-20',
    right: 'sm:items-center sm:justify-end sm:px-10 md:px-20',
    center: 'sm:items-center sm:justify-center',
    none: '',
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const position = slide.position || 'center';

        return (
          <div key={slide.id} className={`${isActive ? 'block' : 'hidden'} w-full`}>
            <div className="relative w-full aspect-[16/6]">
              <Image
                src={slide.imgUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />

              {/* Degrade solo en mobile */}
              <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-black via-transparent to-transparent sm:hidden" />

              {position !== 'none' && slide.overlay && (
                <div className={`absolute inset-0 ${slide.overlay} pointer-events-none`} />
              )}

              {position !== 'none' && (
                <div
                  className={`hidden sm:flex absolute top-1/2 transform -translate-y-1/2 w-full z-10 ${positionClasses[position]}`}
                >
                  <div className="flex flex-col sm:max-w-xl md:max-w-2xl space-y-3 text-white text-center">
                    <h1 className="text-xl sm:text-lg md:text-3xl lg:text-4xl font-bold">{slide.title}</h1>
                    {slide.subtitle && (
                      <p className="text-sm sm:text-xs md:text-sm lg:text-base">{slide.subtitle}</p>
                    )}
                    {slide.ctaLink && slide.ctaText && (
                      <Link
                        href={slide.ctaLink}
                        className={`inline-flex items-center justify-center h-10 sm:h-8 sm: px-8   md:px-30 text-sm sm:text-sm md:text-xl md:h-10 font-medium rounded-lg shadow-md transition-colors duration-300 ${position === 'center' ? 'max-w-96 mx-auto' : ''} ${CTA_COLORS[slide.ctaColor] || CTA_COLORS.red}`}
                        >
                        {slide.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              )}  
            </div>

            <div className="block sm:hidden bg-black text-white px-4 py-4 text-center space-y-3">
              <h1 className="text-xl font-bold">{slide.title}</h1>
              {slide.subtitle && <p className="text-sm">{slide.subtitle}</p>}
              {slide.ctaLink && slide.ctaText && (
                <Link
                  href={slide.ctaLink}
                  className={`inline-flex items-center justify-center h-8 px-4 text-sm font-medium rounded-lg shadow-md transition-colors duration-300 ${CTA_COLORS[slide.ctaColor] || CTA_COLORS.red}`}
                >
                  {slide.ctaText}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-32 sm:bottom-4 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-2">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentSlide(dotIndex)}
              className={`w-3 h-3 rounded-full transition-colors ${dotIndex === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
