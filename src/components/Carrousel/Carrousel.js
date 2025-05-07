'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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

  return (
    <div className="relative w-full h-[80vh] overflow-hidden" ref={containerRef}>
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isCenter = slide.position === 'center';
        const isHidden = slide.position === 'none';

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {(isCenter || isHidden) ? (
              // Mobile override
 <div className="flex flex-col sm:flex-row w-full h-full">
                {/* Imagen */}
                <div className="relative w-full h-[75vh] sm:w-1/2 sm:h-full">
                  <Image
                    src={slide.imgUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {slide.overlay && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none" />
                  )}
                </div>

                {/* Leyenda visible solo en mobile o según tipo */}
                <div className="relative bg-black/90 text-white flex flex-col justify-end items-center w-full px-6 py-6 sm:hidden">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="max-w-xl text-center space-y-3 relative z-10">
                    <h1 className="text-2xl font-bold">{slide.title}</h1>
                    {slide.subtitle && <p className="text-base">{slide.subtitle}</p>}
                    {slide.ctaLink && slide.ctaText && (
                      <Link
                        href={slide.ctaLink}
                        className={`inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-lg shadow-md transition-colors duration-300 ${CTA_COLORS[slide.ctaColor] || CTA_COLORS.red}`}
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Layout original en sm+ */}
                <div className={`hidden sm:block`}>
                  {isCenter ? (
                    // center layout en sm+
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center text-white">
                      <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4">{slide.title}</h1>
                        {slide.subtitle && <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>}
                        {slide.ctaLink && slide.ctaText && (
                          <Link
                            href={slide.ctaLink}
                            className={`inline-flex items-center justify-center h-12 px-6 text-sm font-medium rounded-xl shadow-lg transition-colors duration-300 ${CTA_COLORS[slide.ctaColor] || CTA_COLORS.red}`}
                          >
                            {slide.ctaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              // Layout "left" (ya aplica el diseño requerido en mobile y se adapta en sm+)
              <div className="flex flex-col sm:flex-row w-full h-full">
                {/* Imagen */}
                <div className="relative w-full h-[75vh] sm:w-1/2 sm:h-full">
                  <Image
                    src={slide.imgUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {slide.overlay && (
                    <div className={`absolute inset-0 pointer-events-none ${slide.overlay}`} />
                  )}
                </div>

                {/* Leyenda */}
                <div className="relative bg-black/90 text-white flex flex-col justify-center items-center sm:items-start w-full sm:w-1/2 px-6 py-8 sm:px-12 sm:py-0 h-full">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="max-w-xl text-center sm:text-left space-y-4 relative z-10">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">{slide.title}</h1>
                    {slide.subtitle && <p className="text-base sm:text-lg md:text-xl">{slide.subtitle}</p>}
                    {slide.ctaLink && slide.ctaText && (
                      <Link
                        href={slide.ctaLink}
                        className={`inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-lg shadow-md transition-colors duration-300 ${CTA_COLORS[slide.ctaColor] || CTA_COLORS.red}`}
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Dots siempre visibles en mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none sm:pointer-events-auto">
              <div className="flex gap-2 pointer-events-auto">
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
      })}
    </div>
  );
}
