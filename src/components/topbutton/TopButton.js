"use client"

import { useState, useEffect } from 'react';

export default function TopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={`fixed bottom-0 right-14 z-50 p-2 flex justify-center items-center w-10 h-10 bg-slate-600 hover:bg-slate-800 rounded-tl-lg shadow-lg transition-opacity duration-1000 ease-in-out transform hover:scale-110 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isVisible ? 'delay-300' : ''}`}>
            <button
                onClick={scrollToTop}
                className="text-white flex justify-center items-center"
                aria-label="Scroll to top"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                >
                    <path
                        d="M12 4.293l-6.293 6.293 1.414 1.414L12 7.414l4.879 4.879 1.414-1.414L12 4.293z"
                    />
                </svg>
            </button>
        </div>
    );
}
