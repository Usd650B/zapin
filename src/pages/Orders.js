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
    Trash2
} from 'lucide-react';

export default function Orders() {
    const { currentUser, userType } = useAuth();
    const { stores, orders, updateOrder, deleteOrder, formatPrice } = useStore();
    const navigate = useNavigate();
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Redirect buyers away from seller orders page
    useEffect(() => {
        if (currentUser && userType === 'buyer') {
            navigate('/buyer-dashboard');
        }
    }, [currentUser, userType, navigate]);

    const myStores = stores.filter(store => store.ownerId === currentUser?.uid);
    const myOrders = orders.filter(order => myStores.some(store => store.id === order.storeId));

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
            try {
                await deleteOrder(orderId);
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
            case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'completed': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-24">
            <div className="mb-6 flex items-center">
                <button
                    onClick={() => navigate('/seller-dashboard')}
                    className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-xs text-gray-500">Manage customer orders and shipments</p>
                </div>
            </div>

            <div className="space-y-4">
                {myOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900">No Orders Yet</h2>
                        <p className="text-gray-500 text-sm">When customers buy from your store, orders will appear here.</p>
                    </div>
                ) : (
                    myOrders.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).map(order => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-bold text-gray-900 truncate">#{order.id.slice(-6).toUpperCase()}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                                        <span className="truncate">{order.customerName}</span>
                                        <span>•</span>
                                        <span>{order.items?.length || 0} items</span>
                                    </div>
                                </div>
                                <div className="text-right flex items-center space-x-2">
                                    <p className="text-base font-bold text-gray-900">{formatPrice(order.total)}</p>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            className="text-primary hover:bg-blue-50 p-1 rounded-lg transition-colors"
                                        >
                                            {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors mt-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="bg-gray-50/50 border-t border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Info</h4>
                                            <div className="flex items-start space-x-2">
                                                <User className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                <span className="text-sm text-gray-700">{order.customerName}</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                                <span className="text-sm text-gray-700">{order.customerAddress}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</h4>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-700">{order.customerPhone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-700">{order.customerEmail}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Items</h4>
                                        <div className="space-y-3">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center space-x-3 text-sm">
                                                    {/* Product Photo */}
                                                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjlGQUZCIi8+CjxwYXRoIGQ9Ik0yNCAzMkMxOS41ODIgMzIgMTYgMjguNDE4IDE2IDI0QzE2IDE5LjU4MiAxOS41ODIgMTYgMjQgMTZDMjguNDE4IDE2IDMyIDE5LjU4MiAzMiAyNEMzMiAyOC40MTggMjguNDE4IDMyIDI0IDMyWiIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4K';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-6 h-6 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-gray-900 font-medium truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                                    </div>
                                                    
                                                    {/* Price */}
                                                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-900">Total Amount</span>
                                            <span className="text-base font-bold text-primary">{formatPrice(order.total)}</span>
                                        </div>
                                    </div>

                                    {/* Status Actions */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Update Status</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'processing')}
                                                className={`text-xs font-bold py-2 rounded-xl border transition-all ${order.status === 'processing'
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                Processing
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'shipped')}
                                                className={`text-xs font-bold py-2 rounded-xl border transition-all ${order.status === 'shipped'
                                                    ? 'bg-purple-600 text-white border-purple-600'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                                    }`}
                                            >
                                                Shipped
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'completed')}
                                                className={`text-xs font-bold py-2 rounded-xl border transition-all ${order.status === 'completed'
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                                                    }`}
                                            >
                                                Completed
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                                className={`text-xs font-bold py-2 rounded-xl border transition-all ${order.status === 'cancelled'
                                                    ? 'bg-red-600 text-white border-red-600'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                                                    }`}
                                            >
                                                Cancelled
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
