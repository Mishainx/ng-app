'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CTA_COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-gray-500',
  black: 'bg-black',
  white: 'bg-white border text-black',
};

export default function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="relative w-full aspect-[8/3]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.imgUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              {slide.overlay && (
                <div className={`absolute inset-0 ${slide.overlay}`} />
              )}

              {slide.position !== 'hidden' && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 max-w-screen-xl mx-auto z-20
                    ${
                      slide.position === 'left'
                        ? 'items-start text-left'
                        : slide.position === 'right'
                        ? 'items-end text-right'
                        : 'items-center text-center'
                    }
                  `}
                >
                  <div className="max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4 text-white">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-lg md:text-xl mb-6 text-white">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaLink && slide.ctaText && (
                      <Link
                        href={slide.ctaLink}
                        className={`inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-white rounded-xl shadow-lg transition-colors duration-300 ease-in-out ${
                          CTA_COLORS[slide.ctaColor] || 'bg-red-500 hover:bg-red-700'
                        }`}
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSlide === i ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
