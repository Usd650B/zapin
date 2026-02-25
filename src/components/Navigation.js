import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Zap, Store, ShoppingCart, User, Plus, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
  const { currentUser, userType, logout } = useAuth();
  const { cart } = useStore();
  const location = useLocation();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show navigation on auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">

        {/* Home Link */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/' ? 'text-primary' : 'text-gray-400'}`}
        >
          <Zap className={`w-5 h-5 ${location.pathname === '/' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>

        {/* Dynamic Context Link 1: Shop or Products */}
        <Link
          to={userType === 'seller' ? '/manage-products' : '/explore'}
          className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/explore' || location.pathname === '/manage-products' ? 'text-primary' : 'text-gray-400'}`}
        >
          {userType === 'seller' ? <Plus className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          <span className="text-[10px] font-bold mt-1 uppercase">
            {userType === 'seller' ? 'Add' : 'Shop'}
          </span>
        </Link>

        {/* Dynamic Context Link 2: Orders or Cart */}
        <Link
          to={userType === 'seller' ? '/orders' : '/checkout'}
          className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/orders' || location.pathname === '/checkout' ? 'text-primary' : 'text-gray-400'}`}
        >
          {userType === 'seller' ? (
            <div className="relative">
              <Package className="w-5 h-5" />
            </div>
          ) : (
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </div>
          )}
          <span className="text-[10px] font-bold mt-1 uppercase">
            {userType === 'seller' ? 'Orders' : 'Cart'}
          </span>
        </Link>

        {/* Profile/Dashboard Link */}
        <Link
          to={currentUser ? (userType === 'seller' ? '/seller-dashboard' : '/buyer-dashboard') : '/login'}
          className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname.includes('dashboard') || location.pathname === '/login' ? 'text-primary' : 'text-gray-400'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 uppercase">
            {currentUser ? 'Admin' : 'Login'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
