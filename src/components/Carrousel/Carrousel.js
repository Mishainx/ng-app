'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`,{cache:"no-cache"});
        const data = await res.json();
        console.log(data)
        const visibleSlides = data.payload?.filter((s) => s.visible).sort((a, b) => a.order - b.order);
        setSlides(visibleSlides);
      } catch (err) {
        console.error('Error fetching slides:', err);
      }
    };
    fetchSlides();
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      {/* Slides */}
      <div className="relative w-full h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="flex flex-col sm:flex-row-reverse items-center justify-center w-full h-full">
              {/* Imagen */}
              <div className="relative w-full max-w-[750px] h-full">
                <Image
                  src={slide.imgUrl}
                  alt={slide.title}
                  fill
                  className="object-cover rounded-xl"
                />
                {slide.overlay && (
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: slide.overlay }}
                  />
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center text-center p-6 md:p-8 lg:p-12 max-w-xl z-20">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl xl:text-6xl mb-4 text-white">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl mb-6 text-white">{slide.subtitle}</p>
                )}
                {slide.ctaLink && slide.ctaText && (
                  <Link
                    href={slide.ctaLink}
                    className={`inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-white rounded-xl shadow-lg transition-colors duration-300 ease-in-out ${slide.ctaColor || 'bg-red-500 hover:bg-red-700'}`}
                  >
                    {slide.ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
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
      ASDASD
    </section>
  );
}
