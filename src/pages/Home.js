import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Store, ShoppingCart, User, Share2, Plus, Search, Zap, LogOut, LayoutDashboard, Package } from 'lucide-react';
import InstallPrompt from '../components/InstallPrompt';

// Custom SVG Icons
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Home() {
  const { currentUser, userType, logout } = useAuth();
  const { cart } = useStore();

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

        {/* Features Grid - Role Specific */}
        <div className={`grid ${userType === 'seller' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-12 px-2`}>
          {userType === 'seller' ? (
            // Seller-only features
            <Link
              to="/create-store"
              className="card hover:border-primary/50 transition-all text-left bg-white/50 backdrop-blur-sm border-gray-100 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-extrabold text-gray-900 mb-1 text-sm tracking-tight">Create New Store</h3>
              <p className="text-gray-400 text-[10px] leading-relaxed font-medium">Build your professional mobile store in minutes</p>
            </Link>
          ) : (
            // Buyer-only features
            <>
              <Link
                to="/explore"
                className="card hover:border-primary/50 transition-all text-left bg-white/50 backdrop-blur-sm border-gray-100 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1 text-sm tracking-tight">Browse Stores</h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">Discover amazing products from local sellers</p>
              </Link>
              
              <Link
                to="/checkout"
                className="card hover:border-primary/50 transition-all text-left bg-white/50 backdrop-blur-sm border-gray-100 group relative"
              >
                <div className="w-12 h-12 bg-green-100 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1 text-sm tracking-tight">My Cart</h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">View and manage your shopping cart</p>
                {cart.length > 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </Link>
            </>
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
              <WhatsAppIcon className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => shareStore('facebook')}
              className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-all"
            >
              <FacebookIcon className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => shareStore('instagram')}
              className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center hover:bg-pink-200 transition-all"
            >
              <InstagramIcon className="w-5 h-5 text-pink-600" />
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
