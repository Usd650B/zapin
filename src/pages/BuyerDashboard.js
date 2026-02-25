import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  Search,
  Store,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  CreditCard,
  Truck,
  ArrowLeft,
  Star
} from 'lucide-react';

export default function BuyerDashboard() {
  const { currentUser, userType } = useAuth();
  const { orders, cart, stores, formatPrice } = useStore();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Strictly redirect sellers away from the buyer hub
  useEffect(() => {
    if (currentUser && userType === 'seller') {
      navigate('/seller-dashboard');
    }
  }, [currentUser, userType, navigate]);

  const myOrders = orders.filter(order => order.customerId === currentUser?.uid);

  // Sort orders by date
  const sortedOrders = [...myOrders].sort((a, b) => {
    const dateA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime() / 1000;
    const dateB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime() / 1000;
    return dateB - dateA;
  });

  const orderStats = {
    pending: myOrders.filter(order => order.status === 'pending' || order.status === 'processing').length,
    shipped: myOrders.filter(order => order.status === 'shipped').length,
    completed: myOrders.filter(order => order.status === 'completed').length,
    totalSpent: myOrders.reduce((sum, order) => sum + order.total, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'completed': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ── Premium Header ── */}
      <div className="bg-white px-4 pt-4 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hello, {currentUser?.displayName || 'Shopper'}!</h1>
            <p className="text-xs text-gray-500">Welcome to your shopping dashboard</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{orderStats.pending}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Active</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{orderStats.shipped}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Shipped</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{orderStats.completed}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Done</p>
          </div>
          <div className="bg-primary rounded-2xl p-2 text-center shadow-md">
            <p className="text-sm font-bold text-white">{formatPrice(orderStats.totalSpent)}</p>
            <p className="text-[9px] text-white/80 uppercase font-bold tracking-tighter">Total</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Quick Tools</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/explore')}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-900 tracking-tight">Browse Stores</span>
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-transform relative"
          >
            <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center mb-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-gray-900 tracking-tight">Checkout</span>
            {cart.length > 0 && (
              <span className="absolute top-3 right-5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Suggested Stores ── */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Suggested Stores</h2>
          <Link to="/explore" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">See All</Link>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {stores.slice(0, 5).map(store => (
            <div
              key={store.id}
              onClick={() => navigate(`/store/${store.id}`)}
              className="flex-shrink-0 w-28 bg-white rounded-3xl p-3 border border-gray-100 shadow-sm active:scale-95 transition-transform text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-2 border border-blue-50/50 overflow-hidden">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-7 h-7 text-gray-200" />
                )}
              </div>
              <p className="text-[10px] font-bold text-gray-900 truncate tracking-tight">{store.name}</p>
              <div className="flex items-center justify-center mt-1">
                <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                <span className="text-[8px] font-bold text-gray-400 ml-0.5">4.9</span>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <div className="w-full text-center py-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-[10px] font-bold text-gray-400">No stores available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Order Activity ── */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">My Orders</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{myOrders.length} Records</span>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No Orders Yet</h3>
            <p className="text-gray-500 text-xs mb-6">Seems like you haven't bought anything yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white py-2 px-6 rounded-full text-xs font-bold shadow-lg shadow-primary/20"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map(order => {
              const store = stores.find(s => s.id === order.storeId);
              const orderDate = order.createdAt?.seconds
                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                : new Date(order.createdAt).toLocaleDateString();

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                        {store?.logo ? (
                          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-gray-200" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate tracking-tight">{store?.name || 'Unknown Store'}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">#{order.id.slice(-6).toUpperCase()} • {orderDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary mb-1">{formatPrice(order.total)}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-gray-50/50 px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {/* Preview of items */}
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-400 shadow-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-gray-400 hover:text-primary transition-colors flex items-center text-[10px] font-bold uppercase tracking-widest"
                    >
                      {expandedOrder === order.id ? 'Close' : 'Details'}
                      {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedOrder === order.id && (
                    <div className="p-4 bg-gray-50/30 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-4">
                        {/* Address */}
                        <div>
                          <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                            <MapPin className="w-2.5 h-2.5 mr-1" /> Delivery Address
                          </h5>
                          <p className="text-xs text-gray-600 leading-tight">{order.customerAddress}</p>
                        </div>

                        {/* Payment Info (Mocked based on order data) */}
                        <div className="flex items-center justify-between py-2 border-y border-gray-100 border-dashed">
                          <div>
                            <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                              <CreditCard className="w-2.5 h-2.5 mr-1" /> Payment Method
                            </h5>
                            <p className="text-xs text-gray-600">Secure Payment Gateway</p>
                          </div>
                          <div className="text-right">
                            <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-end">
                              <Truck className="w-2.5 h-2.5 mr-1" /> Shipping
                            </h5>
                            <p className="text-xs text-gray-600">Standard Delivery (Free)</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Purchased Items</h5>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div className="flex-1 min-w-0 pr-4">
                                <p className="text-gray-900 font-bold truncate tracking-tight">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                              <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-900">Order Total</span>
                          <span className="text-sm font-bold text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Help / Support Card ── */}
      <div className="px-4 mt-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-sm font-bold mb-1">Need help with an order?</h3>
            <p className="text-[10px] text-gray-400 mb-4 max-w-[180px]">Our support team is always here for you. We protect every transaction.</p>
            <a
              href="https://wa.me/255749097220"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2 px-4 rounded-xl border border-white/10 transition-colors"
            >
              Contact Support
            </a>
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-20">
            <CheckCircle className="w-32 h-32 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
