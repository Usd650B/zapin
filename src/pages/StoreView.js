import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import {
  ShoppingCart, Plus, Minus, ArrowLeft, Store, Package,
  Edit, Copy, Shield, Star, Truck, Heart, ChevronRight,
  Tag, CheckCircle, Zap
} from 'lucide-react';

export default function StoreView() {
  const { storeId } = useParams();
  const location = useLocation();
  const { stores, products, addToCart, cart, loading, formatPrice } = useStore();
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();

  // Safe URL Decoding (Modern Approach)
  const decodeURLData = (encoded) => {
    try {
      if (!encoded) return null;
      const json = decodeURIComponent(atob(encoded).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to decode store data", e);
      return null;
    }
  };

  // Safe URL Encoding (Modern Approach)
  const encodeURLData = (data) => {
    try {
      const json = JSON.stringify(data);
      return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode('0x' + p1)
      ));
    } catch (e) {
      console.error("Failed to encode store data", e);
      return "";
    }
  };

  // 1. Get Store Data
  const store = useMemo(() => {
    const foundLocal = (stores || []).find(s => s.id === storeId);
    if (foundLocal) return foundLocal;

    const params = new URLSearchParams(location.search);
    const decoded = decodeURLData(params.get('d'));
    return decoded?.store || null;
  }, [storeId, stores, location.search]);

  // 2. Get Products
  const storeProducts = useMemo(() => {
    if (!store?.id) return [];

    // First, try local products
    const localProducts = (products || []).filter(p => p.storeId === store.id);
    if (localProducts.length > 0) return localProducts;

    // Fallback to URL products
    const params = new URLSearchParams(location.search);
    const decoded = decodeURLData(params.get('d'));
    return decoded?.products || [];
  }, [store, products, location.search]);

  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [wishlist, setWishlist] = useState({});

  const isStoreOwner = useMemo(() => {
    const isSharedLink = new URLSearchParams(location.search).has('d');
    return !isSharedLink && store && currentUser && store.ownerId === currentUser.uid;
  }, [store, currentUser, location.search]);

  const canBuy = userType !== 'seller' && !isStoreOwner;

  const buildShareableLink = () => {
    if (!store) return "";
    const base = window.location.origin;
    return `${base}/store/${storeId}`;
  };

  const copyStoreLink = () => {
    const link = buildShareableLink();
    if (link) {
      navigator.clipboard.writeText(link);
      alert('Store link copied!');
    }
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Store Not Found</h2>
          <p className="text-gray-400 text-xs mb-4">This store doesn't exist or the link is invalid.</p>
          <button onClick={() => navigate('/')} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (!product) return;
    const qty = quantities[product.id] || 1;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  const updateQuantity = (productId, delta) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] || 1) + delta) }));
  };

  const cartItemCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const primaryColor = store?.primaryColor || '#9333ea';
  const secondaryColor = store?.secondaryColor || '#a855f7';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Compact Store Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="px-3 pt-3 pb-3">
          {/* Back + Cart row */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="flex items-center text-white/80 hover:text-white text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />Back
            </button>
            {canBuy && cartItemCount > 0 && (
              <button
                onClick={() => navigate('/checkout')}
                className="flex items-center space-x-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium"
              >
                <ShoppingCart className="w-3 h-3" />
                <span>Cart ({cartItemCount})</span>
                <span className="font-bold">{formatPrice(cartTotal)}</span>
              </button>
            )}
          </div>

          {/* Store identity — compact row */}
          <div className="flex items-center space-x-2">
            {store?.logo ? (
              <img src={store.logo} alt={store.name} className="w-10 h-10 object-cover rounded-xl border border-white/30 flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm font-bold text-white truncate">{store.name}</h1>
                {isStoreOwner && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ fontSize: '9px' }}>
                    Your Store
                  </span>
                )}
              </div>
              <p className="text-white/75 truncate" style={{ fontSize: '11px' }}>{store.description}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full" style={{ fontSize: '9px' }}>{store.category}</span>
                <span className="text-white/70" style={{ fontSize: '9px' }}>{storeProducts.length} products</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 text-yellow-300 fill-yellow-300" />)}
                  <span className="text-white/70 ml-0.5" style={{ fontSize: '9px' }}>4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Owner Bar ── */}
      {isStoreOwner && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs font-medium text-amber-800">Owner View</p>
          </div>
          <div className="flex space-x-1.5">
            <button onClick={copyStoreLink} className="flex items-center space-x-1 bg-white border border-amber-300 text-amber-700 px-2 py-1 rounded-lg" style={{ fontSize: '10px' }}>
              <Copy className="w-2.5 h-2.5" /><span>Copy Link</span>
            </button>
            <button onClick={() => navigate('/manage-products')} className="flex items-center space-x-1 bg-amber-600 text-white px-2 py-1 rounded-lg" style={{ fontSize: '10px' }}>
              <Edit className="w-2.5 h-2.5" /><span>Edit Store</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Buyer Trust Bar ── */}
      {!isStoreOwner && (
        <div className="bg-white border-b border-gray-100 px-3 py-1.5">
          <div className="flex items-center justify-around">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-green-700 font-medium" style={{ fontSize: '10px' }}>Buyer Protected</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center space-x-1">
              <Truck className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700 font-medium" style={{ fontSize: '10px' }}>Fast Delivery</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-purple-600" />
              <span className="text-purple-700 font-medium" style={{ fontSize: '10px' }}>Secure Pay</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Cart Bar (only when has items) ── */}
      {canBuy && cartItemCount > 0 && (
        <div className="sticky top-0 z-30 bg-white shadow px-3 py-2 border-b border-gray-100">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            <div className="flex items-center space-x-1.5">
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart</span>
              <span className="bg-white/25 px-1.5 py-0.5 rounded-full text-xs">{cartItemCount}</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <span className="font-bold">{formatPrice(cartTotal)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* ── Products ── */}
      <div className="px-2 pt-3 pb-20">
        {storeProducts.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No products yet</p>
            {isStoreOwner && (
              <button onClick={() => navigate('/manage-products')} className="mt-3 bg-primary text-white px-4 py-2 rounded-xl text-xs font-semibold">
                Add Products
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-2 px-1">
              {storeProducts.length} Products
            </p>
            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-2">
              {storeProducts.map(product => {
                const inStock = product.stock === undefined || product.stock > 0;
                const lowStock = product.stock !== undefined && product.stock > 0 && product.stock < 5;
                const qty = quantities[product.id] || 1;
                const isAdded = addedToCart[product.id];
                const isWished = wishlist[product.id];

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden flex flex-col border border-gray-100"
                    style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
                  >
                    {/* Image */}
                    <div className="relative bg-gray-50" style={{ aspectRatio: '1/1' }}>
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-200" />
                        </div>
                      )}
                      {/* Wishlist */}
                      <button
                        onClick={() => setWishlist(p => ({ ...p, [product.id]: !p[product.id] }))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center"
                      >
                        <Heart className={`w-3 h-3 ${isWished ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                      </button>
                      {/* Stock badge */}
                      {!inStock && (
                        <span className="absolute top-1.5 left-1.5 bg-red-500 text-white rounded px-1" style={{ fontSize: '8px' }}>Out of Stock</span>
                      )}
                      {lowStock && (
                        <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white rounded px-1" style={{ fontSize: '8px' }}>Only {product.stock} left</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2 flex flex-col flex-1">
                      {/* Name */}
                      <p className="text-gray-900 font-semibold leading-tight line-clamp-2 mb-1" style={{ fontSize: '11px' }}>
                        {product.name}
                      </p>

                      {/* Stars */}
                      <div className="flex items-center space-x-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-gray-400 ml-0.5" style={{ fontSize: '9px' }}>(42)</span>
                      </div>

                      {/* Price */}
                      <p className="font-bold mb-1" style={{ color: primaryColor, fontSize: '14px' }}>
                        {formatPrice(product.price)}
                      </p>

                      {/* Free shipping */}
                      <div className="flex items-center space-x-0.5 mb-2">
                        <Tag className="w-2.5 h-2.5 text-green-600" />
                        <span className="text-green-600 font-medium" style={{ fontSize: '9px' }}>Free Shipping</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto">
                        {canBuy && inStock ? (
                          <>
                            {/* Qty selector */}
                            <div className="flex items-center border border-gray-200 rounded-lg mb-1.5 overflow-hidden">
                              <button onClick={() => updateQuantity(product.id, -1)} className="w-7 h-6 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="flex-1 text-center text-gray-900 font-semibold" style={{ fontSize: '11px' }}>{qty}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="w-7 h-6 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            {/* Add to Cart */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full py-1.5 rounded-lg text-white font-bold flex items-center justify-center space-x-1 active:scale-95 transition-transform"
                              style={{
                                fontSize: '10px',
                                background: isAdded
                                  ? 'linear-gradient(135deg,#10b981,#059669)'
                                  : `linear-gradient(135deg,${primaryColor},${secondaryColor})`,
                              }}
                            >
                              {isAdded ? (
                                <><CheckCircle className="w-3 h-3" /><span>Added!</span></>
                              ) : (
                                <><ShoppingCart className="w-3 h-3" /><span>Add to Cart</span></>
                              )}
                            </button>
                          </>
                        ) : isStoreOwner ? (
                          <div className="w-full py-1.5 rounded-lg bg-gray-100 text-gray-400 text-center" style={{ fontSize: '10px' }}>
                            Your Product
                          </div>
                        ) : (
                          <div className="w-full py-1.5 rounded-lg bg-gray-100 text-gray-400 text-center" style={{ fontSize: '10px' }}>
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
