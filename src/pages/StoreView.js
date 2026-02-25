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
    addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [product.id]: false })), 1500);
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
            {/* Modern 2-column grid */}
            <div className="grid grid-cols-2 gap-3">
              {storeProducts.map(product => {
                const inStock = product.stock === undefined || product.stock > 0;
                const lowStock = product.stock !== undefined && product.stock > 0 && product.stock < 5;
                const isAdded = addedToCart[product.id];
                const isWished = wishlist[product.id];

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                  >
                    {/* Product Image */}
                    <div className="relative bg-gray-50" style={{ aspectRatio: '1/1' }}>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-200" />
                        </div>
                      )}
                      
                      {/* Modern Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {!inStock && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Out of Stock
                          </span>
                        )}
                        {lowStock && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => setWishlist(p => ({ ...p, [product.id]: !p[product.id] }))}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all"
                      >
                        <Heart className={`w-4 h-4 ${isWished ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm leading-tight">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs">(42)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg" style={{ color: primaryColor }}>
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-gray-400 text-xs line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                        
                        {/* Discount Badge */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Free Shipping Badge */}
                      <div className="flex items-center gap-1 mb-3">
                        <Tag className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 text-xs font-medium">Free Shipping</span>
                      </div>

                      {/* Simple Add to Cart Button */}
                      <div className="mt-auto">
                        {canBuy && inStock ? (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                              background: isAdded
                                ? 'linear-gradient(135deg,#10b981,#059669)'
                                : `linear-gradient(135deg,${primaryColor},${secondaryColor})`,
                            }}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Added to Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        ) : isStoreOwner ? (
                          <div className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-center text-sm">
                            Your Product
                          </div>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-center text-sm">
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
