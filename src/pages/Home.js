import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Store, ShoppingCart, User, Share2, Instagram, Facebook, MessageCircle, Plus, Search, Zap, LogOut, LayoutDashboard, Package } from 'lucide-react';
import InstallPrompt from '../components/InstallPrompt';

export default function Home() {
  const { currentUser, userType, logout } = useAuth();

  const shareStore = (platform) => {
    const message = "Check out this amazing mobile store app! Create your own store or shop from local sellers.";
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('/store/')[0];
    const url = baseUrl;

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(message + ' ' + url);
        alert('Link copied! Share it on Instagram');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 pb-24">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="mb-6 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-700 via-purple-500 to-indigo-600 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
            <Zap className="w-12 h-12 text-white relative z-10" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-gray-900" style={{ fontFamily: 'Outfit' }}>
            Zap<span className="text-primary italic">in</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Premium Tanzanian Commerce</p>
        </div>

        {/* User Role Status & Auth Actions */}
        <div className="mb-8 flex flex-col items-center">
          {currentUser ? (
            <div className="flex flex-col items-center">
              <div className="bg-purple-50 border border-purple-100 px-4 py-2 rounded-2xl flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {userType === 'seller' ? 'Seller Account' : 'Buyer Account'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    logout();
                  }
                }}
                className="flex items-center space-x-1.5 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="bg-primary text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-md shadow-primary/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-md"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-12">
          {currentUser && (
            <div className="grid grid-cols-1 gap-3 px-4">
              <Link
                to={userType === 'seller' ? '/seller-dashboard' : '/buyer-dashboard'}
                className="btn-primary py-4 text-center block shadow-lg shadow-primary/25"
              >
                {userType === 'seller' ? <LayoutDashboard className="w-5 h-5 inline mr-2" /> : <Package className="w-5 h-5 inline mr-2" />}
                My {userType === 'seller' ? 'Seller' : 'Buyer'} Dashboard
              </Link>

              {userType === 'seller' ? (
                <Link
                  to="/manage-products"
                  className="block w-full bg-white border border-gray-200 text-gray-900 py-3.5 px-4 rounded-2xl font-bold text-sm tracking-tight hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <Package className="w-4 h-4 mr-2 text-primary" />
                  Manage Inventory
                </Link>
              ) : (
                <Link
                  to="/explore"
                  className="block w-full bg-white border border-gray-200 text-gray-900 py-3.5 px-4 rounded-2xl font-bold text-sm tracking-tight hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
                >
                  <Search className="w-4 h-4 mr-2 text-primary" />
                  Browse Shops
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid ${userType === 'seller' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-12 px-2`}>
          <Link
            to={currentUser ? (userType === 'buyer' ? '/register' : '/create-store') : '/register'}
            className="card hover:border-primary/50 transition-all text-left bg-white/50 backdrop-blur-sm border-gray-100 group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-extrabold text-gray-900 mb-1 text-sm tracking-tight">Create Store</h3>
            <p className="text-gray-400 text-[10px] leading-relaxed font-medium">Build your professional mobile store in minutes</p>
          </Link>

          {userType !== 'seller' && (
            <Link
              to="/explore"
              className="card hover:border-primary/50 transition-all text-left bg-white/50 backdrop-blur-sm border-gray-100 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-extrabold text-gray-900 mb-1 text-sm tracking-tight">Shop Local</h3>
              <p className="text-gray-400 text-[10px] leading-relaxed font-medium">Discover amazing products from creators nearby</p>
            </Link>
          )}
        </div>

        {/* Social Sharing */}
        <div className="card">
          <h3 className="font-semibold text-black mb-4 text-sm">Share Zapin</h3>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => shareStore('whatsapp')}
              className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center hover:bg-green-200 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => shareStore('facebook')}
              className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-all"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => shareStore('instagram')}
              className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center hover:bg-pink-200 transition-all"
            >
              <Instagram className="w-5 h-5 text-pink-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">10K+</div>
            <div className="text-xs text-gray-600">Active Stores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">50K+</div>
            <div className="text-xs text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">25K+</div>
            <div className="text-xs text-gray-600">Happy Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}
