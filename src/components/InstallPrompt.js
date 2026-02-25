import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, ArrowBigDown } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's IOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        // Capture the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show the prompt after a short delay
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // If it's IOS, show instructions after a delay
        if (isIOSDevice) {
            setTimeout(() => setShowPrompt(true), 5000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-purple-100 p-5 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <button
                    onClick={() => setShowPrompt(false)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-purple-700 to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-100">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
                            Download Zapin App
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1 pr-6">
                            {isIOS
                                ? 'Tap "Share" then "Add to Home Screen" to install Zapin on your iPhone.'
                                : 'Install Zapin on your home screen for a faster and smoother experience.'
                            }
                        </p>

                        {!isIOS ? (
                            <button
                                onClick={handleInstallClick}
                                className="mt-3 flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Install Now</span>
                            </button>
                        ) : (
                            <div className="mt-3 flex items-center space-x-2 text-primary font-bold text-[10px] uppercase tracking-wider">
                                <ArrowBigDown className="w-3.5 h-3.5 animate-bounce" />
                                <span>Follow instructions above</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
