import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

export default function Checkout() {
  const { currentUser, userType } = useAuth();
  const { cart, removeFromCart, placeOrder, stores, formatPrice } = useStore();
  const navigate = useNavigate();

  // Strictly redirect sellers away from checkout
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

  const [quantities, setQuantities] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill customer info with user data when available
  useEffect(() => {
    if (currentUser) {
      setCustomerInfo(prev => ({
        ...prev,
        name: prev.name || currentUser.displayName || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phoneNumber || ''
      }));
    }
  }, [currentUser]);

  // Group cart items by store
  const cartByStore = cart.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = {
        store: stores.find(s => s.id === item.storeId),
        items: []
      };
    }
    acc[item.storeId].items.push(item);
    return acc;
  }, {});

  const updateQuantity = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }));
  };

  const getItemTotal = (item) => {
    const quantity = quantities[item.id] || item.quantity || 1;
    return item.price * quantity;
  };

  const getStoreTotal = (storeItems) => {
    return storeItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  };

  const getGrandTotal = () => {
    return Object.values(cartByStore).reduce((sum, { items }) =>
      sum + getStoreTotal(items), 0
    );
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return alert('Please fill in all customer information');
    }

    // Ensure user is authenticated
    if (!currentUser || !currentUser.uid) {
      return alert('Please login to place an order');
    }

    setLoading(true);

    try {
      // Create separate orders for each store
      const orderPromises = Object.entries(cartByStore).map(([storeId, { store, items }]) => {
        const orderData = {
          storeId,
          storeName: store?.name || 'Unknown Store',
          customerId: currentUser.uid, // Remove optional chaining since we validated above
          customerName: customerInfo.name,
          customerEmail: customerInfo.email || currentUser.email || '',
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantities[item.id] || item.quantity || 1,
            image: item.image || item.images?.[0] || null
          })),
          total: getStoreTotal(items)
        };

        return placeOrder(orderData);
      });

      await Promise.all(orderPromises);
      navigate('/buyer-dashboard');
    } catch (error) {
      console.error('Error placing orders:', error);
      alert('Failed to place orders. Please try again.');
    }

    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to checkout</p>
          <button
            onClick={() => navigate('/explore')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Browse Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Review your order and provide delivery information</p>
      </div>

      {/* Cart Items by Store */}
      <div className="space-y-6 mb-6">
        {Object.entries(cartByStore).map(([storeId, { store, items }]) => (
          <div key={storeId} className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 mb-3">{store?.name || 'Unknown Store'}</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{formatPrice(item.price)} each</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-1 text-sm font-medium">
                        {quantities[item.id] || item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(getItemTotal(item))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Store Total:</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(getStoreTotal(items))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your delivery address"
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(getGrandTotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery:</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">{formatPrice(0)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total:</span>
            <span className="font-bold text-xl text-primary">
              {formatPrice(getGrandTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
