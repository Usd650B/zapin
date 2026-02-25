import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Zap, Store, ShoppingCart, User, Plus, LogOut, LayoutDashboard, Package } from 'lucide-react';

export default function Navigation() {
  const { currentUser, userType, logout } = useAuth();
  const { cart } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Only calculate cart items for buyers
  const cartItemCount = userType === 'buyer' ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

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
        {userType === 'seller' ? (
          <Link
            to="/manage-products"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/manage-products' ? 'text-primary' : 'text-gray-400'}`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase">Add</span>
          </Link>
        ) : (
          <Link
            to="/explore"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/explore' ? 'text-primary' : 'text-gray-400'}`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase">Shop</span>
          </Link>
        )}

        {/* Dynamic Context Link 2: Orders or Cart */}
        {userType === 'seller' ? (
          <Link
            to="/orders"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/orders' ? 'text-primary' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase">Orders</span>
          </Link>
        ) : (
          <Link
            to="/buyer-orders"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/buyer-orders' ? 'text-primary' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase">Orders</span>
          </Link>
        )}

        {/* Dynamic Context Link 3: Cart for buyers only */}
        {userType === 'buyer' && (
          <Link
            to="/checkout"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname === '/checkout' ? 'text-primary' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase">Cart</span>
          </Link>
        )}

        {/* Admin Link - Direct access */}
        {currentUser && (
          <Link
            to="/admin"
            className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase">Admin</span>
          </Link>
        )}

        {/* Profile/Dashboard Link */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            if (!currentUser) return navigate('/login');
            try {
              const udoc = await getDoc(doc(db, 'users', currentUser.uid));
              const role = udoc.exists() ? (udoc.data().type || userType) : userType;
              if (role === 'seller') return navigate('/seller-dashboard');
              return navigate('/buyer-dashboard');
            } catch (err) {
              console.error('Error fetching user role, falling back to context:', err);
              if (userType === 'seller') return navigate('/seller-dashboard');
              return navigate('/buyer-dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center w-full transition-all ${location.pathname.includes('dashboard') || location.pathname === '/login' || location.pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-400'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 uppercase">
            {currentUser ? 'Account' : 'Login'}
          </span>
        </button>
      </div>
    </nav>
  );
}
