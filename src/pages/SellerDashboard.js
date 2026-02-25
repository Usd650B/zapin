import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Store, Package, ShoppingCart, Plus, Share2, TrendingUp, Users, Instagram, Facebook, MessageCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function SellerDashboard() {
  const { currentUser, userType } = useAuth();
  const { stores, products, orders, deleteStore, formatPrice } = useStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // Redirect buyers away from seller dashboard
  useEffect(() => {
    if (currentUser && userType === 'buyer') {
      window.location.href = '/';
    }
  }, [currentUser, userType]);

  const myStores = stores.filter(store => store.ownerId === currentUser?.uid);
  const myProducts = products.filter(product => product.storeId && myStores.some(store => store.id === product.storeId));
  const myOrders = orders.filter(order => myStores.some(store => store.id === order.storeId));

  const totalRevenue = myOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = myOrders.filter(order => order.status === 'pending').length;

  const buildShareableLink = (store) => {
    if (!store) return "";
    const base = window.location.origin;
    return `${base}/store/${store.id}`;
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? All products in this store will also be deleted. This cannot be undone.')) {
      try {
        await deleteStore(storeId);
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Failed to delete store');
      }
    }
  };

  const shareStoreOnSocial = (store, platform) => {
    const storeUrl = buildShareableLink(store);
    const message = `Check out ${store.name}! ${store.description}`;

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + storeUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(message + ' ' + storeUrl);
        alert('Store link copied! Share it on Instagram');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const copyStoreLink = (store) => {
    const link = buildShareableLink(store);
    navigator.clipboard.writeText(link);
    alert('Store link copied to clipboard! Share this with your buyers.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your stores and track sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{myStores.length}</p>
          <p className="text-xs text-gray-600">Stores</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-secondary" />
            <span className="text-xs text-gray-500">Listed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{myProducts.length}</p>
          <p className="text-xs text-gray-600">Products</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          <p className="text-xs text-gray-600">Orders</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-gray-600">Total Sales</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/create-store"
            className="bg-primary text-white p-3 rounded-lg text-center hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">New Store</span>
          </Link>

          <Link
            to="/manage-products"
            className="bg-secondary text-white p-3 rounded-lg text-center hover:bg-green-600 transition-colors"
          >
            <Package className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Products</span>
          </Link>

          <Link
            to="/orders"
            className="bg-accent text-white p-3 rounded-lg text-center hover:bg-orange-600 transition-colors"
          >
            <div className="relative inline-block">
              <ShoppingCart className="w-5 h-5 mx-auto mb-1" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-sm font-medium">Orders</span>
          </Link>
        </div>
      </div>

      {/* My Stores */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Stores</h2>
          {myStores.length === 0 && (
            <Link
              to="/create-store"
              className="text-primary text-sm font-medium hover:underline"
            >
              Create First Store
            </Link>
          )}
        </div>

        {myStores.length === 0 ? (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No stores yet</p>
            <Link
              to="/create-store"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors inline-block"
            >
              Create Store
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myStores.map(store => (
              <div key={store.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyStoreLink(store)}
                      className="text-primary hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Delete store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>{products.filter(p => p.storeId === store.id).length} products</span>
                  <Link
                    to={`/store/${store.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    View Store
                  </Link>
                </div>

                {/* Social Media Sharing */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-600 mb-2">Share your store:</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareStoreOnSocial(store, 'whatsapp')}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareStoreOnSocial(store, 'facebook')}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareStoreOnSocial(store, 'instagram')}
                      className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors"
                      title="Share on Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          {myOrders.length > 0 && (
            <Link to="/orders" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          )}
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.slice(0, 5).map(order => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Help / Support Card ── */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-sm font-bold mb-1">Need help with your store?</h3>
            <p className="text-[10px] text-gray-400 mb-4 max-w-[200px]">Our merchant support team is available 24/7 to help you grow your business.</p>
            <a
              href="https://wa.me/255749097220"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2 px-4 rounded-xl border border-white/10 transition-colors"
            >
              Contact merchant support
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
