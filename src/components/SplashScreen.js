import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 400); // Wait for fade out animation
        }, 1200);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) {
        return (
            <div className="fixed inset-0 bg-white z-[9999] transition-opacity duration-500 opacity-0 pointer-events-none flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-purple-700 to-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                    <Zap className="w-12 h-12 text-white fill-current" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
            <div className="relative">
                {/* Animated Rings */}
                <div className="absolute inset-0 scale-[2.5] bg-purple-50 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 scale-[1.5] bg-purple-100 rounded-full animate-pulse opacity-20"></div>

                {/* Logo Container */}
                <div className="relative w-28 h-28 bg-gradient-to-tr from-purple-700 to-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-bounce">
                    <Zap className="w-14 h-14 text-white fill-current" />
                </div>
            </div>

            {/* Brand Name */}
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900" style={{ fontFamily: 'Outfit' }}>
                    Zap<span className="text-primary italic">in</span>
                </h1>
                <p className="mt-2 text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Premium Commerce</p>
            </div>

            {/* Loading Bar */}
            <div className="absolute bottom-12 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-700 to-primary w-0 animate-[loading_2s_ease-in-out_forwards]"></div>
            </div>
        </div>
    );
}
