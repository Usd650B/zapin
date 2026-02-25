import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  X
} from 'lucide-react';

export default function BuyerOrders() {
  const { currentUser, userType } = useAuth();
  const { orders, cart, stores, formatPrice, updateOrder } = useStore();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect sellers away from buyer orders page
  useEffect(() => {
    if (currentUser && userType === 'seller') {
      navigate('/seller-dashboard');
    }
  }, [currentUser, userType, navigate]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const myOrders = orders.filter(order => order.customerId === currentUser?.uid);

  // Sort orders by date
  const sortedOrders = [...myOrders].sort((a, b) => {
    const dateA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime() / 1000;
    const dateB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime() / 1000;
    return dateB - dateA;
  });

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

  const handleClaimProduct = async (orderId, received) => {
    try {
      const newStatus = received ? 'completed' : 'cancelled';
      await updateOrder(orderId, { 
        status: newStatus,
        buyerClaimed: true,
        buyerClaimDate: new Date().toISOString(),
        buyerReceived: received
      });
      
      // Show success message
      alert(received ? 'Order marked as received! Thank you for your purchase.' : 'Order marked as not received. We\'ll investigate this issue.');
      
      // Refresh the orders list
      setExpandedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ── Premium Header ── */}
      <div className="bg-white px-4 pt-4 pb-6 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            <p className="text-xs text-gray-500">Track and manage your purchases</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{myOrders.filter(order => order.status === 'pending' || order.status === 'processing').length}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Active</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{myOrders.filter(order => order.status === 'shipped').length}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Shipped</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 text-center border border-gray-100">
            <p className="text-sm font-bold text-gray-900">{myOrders.filter(order => order.status === 'completed').length}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Done</p>
          </div>
          <div className="bg-primary rounded-2xl p-2 text-center shadow-md">
            <p className="text-sm font-bold text-white">{formatPrice(myOrders.reduce((sum, order) => sum + order.total, 0))}</p>
            <p className="text-[9px] text-white/80 uppercase font-bold tracking-tighter">Total</p>
          </div>
        </div>
      </div>

      {/* ── Claims Section ── */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Pending Claims</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {myOrders.filter(order => order.status === 'shipped' && !order.buyerClaimed).length} Pending
          </span>
        </div>

        {myOrders.filter(order => order.status === 'shipped' && !order.buyerClaimed).length === 0 ? (
          <div className="bg-white rounded-[2rem] p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">All Orders Claimed</h3>
            <p className="text-gray-500 text-xs">Great! You've confirmed all your shipped orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.filter(order => order.status === 'shipped' && !order.buyerClaimed).map(order => {
              const store = stores.find(s => s.id === order.storeId);
              const orderDate = order.createdAt?.seconds
                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                : new Date(order.createdAt).toLocaleDateString();

              return (
                <div key={order.id} className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-blue-100 overflow-hidden">
                        {store?.logo ? (
                          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-blue-200" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-blue-900 truncate tracking-tight">{store?.name || 'Unknown Store'}</h4>
                        <p className="text-[10px] text-blue-700 font-medium">#{order.id.slice(-6).toUpperCase()} • {orderDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-900 mb-1">{formatPrice(order.total)}</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
                        Action Required
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3">
                    <h5 className="text-xs font-bold text-blue-900 mb-2">Did you receive this order?</h5>
                    <div className="flex items-center space-x-2 mb-3">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-600">
                          {item.name.charAt(0)}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleClaimProduct(order.id, true)}
                        className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Yes, I Received It
                      </button>
                      <button
                        onClick={() => handleClaimProduct(order.id, false)}
                        className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Not Received
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── All Orders ── */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">All Orders</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{myOrders.length} Total</span>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No Orders Yet</h3>
            <p className="text-gray-500 text-xs mb-6">Seems like you haven't bought anything yet.</p>
            <button
              onClick={() => navigate('/explore')}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                          {store?.logo ? (
                            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-200" />
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

                    {/* Claim Status */}
                    {order.buyerClaimed && (
                      <div className="mb-3 p-3 rounded-2xl border text-center">
                        {order.buyerReceived ? (
                          <div className="bg-green-50 border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xs font-bold text-green-900">Order Confirmed as Received</p>
                          </div>
                        ) : (
                          <div className="bg-red-50 border-red-100">
                            <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                            <p className="text-xs font-bold text-red-900">Order Marked as Not Received</p>
                          </div>
                        )}
                      </div>
                    )}

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

                        {/* Items */}
                        <div className="space-y-3">
                          <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Purchased Items</h5>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-xs">
                              {/* Product Photo */}
                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjlGQUZCIi8+CjxwYXRoIGQ9Ik0yMCAyNkMxNS41ODIgMjYgMTIgMjIuNDE4IDEyIDIwQzEyIDE1LjU4MiAxNS41ODIgMTIgMjAgMTJDMjQuNDE4IDEyIDI4IDE1LjU4MiAyOCAyMEMyOCAyMi40MTggMjQuNDE4IDI2IDIwIDI2WiIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4K';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-bold truncate tracking-tight">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                              
                              {/* Price */}
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
    </div>
  );
}
