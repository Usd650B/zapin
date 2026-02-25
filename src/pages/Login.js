import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, Store, ShoppingCart, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('seller');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password, userType);

      // Redirect based on user type
      if (userType === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/buyer-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-purple-100 rotate-6 hover:rotate-0 transition-transform duration-500">
            <Zap className="w-10 h-10 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Welcome back!
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Sign in to your Zapin account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 border border-white">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-xs font-bold flex items-center">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`py-4 px-4 rounded-2xl font-bold transition-all flex flex-col items-center group relative overflow-hidden ${userType === 'seller'
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'bg-white text-gray-400 border border-gray-100 hover:border-purple-200'
                    }`}
                >
                  <Store className={`w-5 h-5 mb-1.5 ${userType === 'seller' ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
                  <span className="text-[10px] uppercase tracking-tighter">Seller</span>
                  {userType === 'seller' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={`py-4 px-4 rounded-2xl font-bold transition-all flex flex-col items-center group relative overflow-hidden ${userType === 'buyer'
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'bg-white text-gray-400 border border-gray-100 hover:border-purple-200'
                    }`}
                >
                  <ShoppingCart className={`w-5 h-5 mb-1.5 ${userType === 'buyer' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                  <span className="text-[10px] uppercase tracking-tighter">Buyer</span>
                  {userType === 'buyer' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 px-6 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all outline-none"
                placeholder="name@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Your Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 px-6 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all outline-none pr-14"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-sm tracking-tight hover:shadow-xl hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center">
            <p className="text-gray-400 text-xs font-medium">
              New to Zapin?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
            <div className="mt-4 flex items-center space-x-1 opacity-20">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

