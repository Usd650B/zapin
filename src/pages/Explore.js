import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import {
    Store,
    Search,
    ArrowLeft,
    ChevronRight,
    Star,
    ShoppingBag,
    MapPin
} from 'lucide-react';

export default function Explore() {
    const { currentUser, userType } = useAuth();
    const { stores } = useStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Strictly redirect sellers away from exploring other shops
    useEffect(() => {
        if (currentUser && userType === 'seller') {
            navigate('/seller-dashboard');
        }
    }, [currentUser, userType, navigate]);

    console.log('Explore Page - Stores from Context:', stores);

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log('Explore Page - Filtered Stores:', filteredStores);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ── Premium Header ── */}
            <div className="bg-white px-4 pt-4 pb-6 rounded-b-[2.5rem] shadow-sm sticky top-0 z-10">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Explore Stores</h1>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search shops or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* ── Store Grid ── */}
            <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {filteredStores.length} Stores Found
                    </h2>
                </div>

                {filteredStores.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                        <Store className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-gray-900 font-bold">No stores found</h3>
                        <p className="text-gray-500 text-xs">Try searching for something else</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredStores.map(store => (
                            <div
                                key={store.id}
                                onClick={() => navigate(`/store/${store.id}`)}
                                className="bg-white rounded-[2rem] p-4 flex items-center space-x-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30"
                            >
                                {/* Store Logo */}
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden flex items-center justify-center">
                                    {store.logo ? (
                                        <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store className="w-8 h-8 text-gray-200" />
                                    )}
                                </div>

                                {/* Store Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-1 mb-0.5">
                                        <h3 className="font-bold text-gray-900 truncate tracking-tight">{store.name}</h3>
                                        <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded-full">
                                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-bold text-yellow-700 ml-0.5">4.9</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{store.description}</p>

                                    <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        <div className="flex items-center">
                                            <ShoppingBag className="w-3 h-3 mr-1" />
                                            Open Shop
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Global
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Featured Promotions ── */}
            <div className="px-4 mt-8">
                <div className="bg-primary rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-lg shadow-primary/20">
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">New Arrivals</span>
                        <h3 className="text-xl font-bold mt-2 mb-1">Flash Sales Today!</h3>
                        <p className="text-xs text-white/80 mb-4 max-w-[170px]">Get up to 40% off on selected stores this weekend.</p>
                        <button className="bg-white text-primary text-[10px] font-bold py-2 px-6 rounded-full uppercase tracking-wider shadow-sm">
                            Discover Now
                        </button>
                    </div>
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-20 rotate-12">
                        <ShoppingBag className="w-32 h-32" />
                    </div>
                </div>
            </div>
        </div>
    );
}
