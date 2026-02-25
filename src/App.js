import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import Navigation from './components/Navigation';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerOrders from './pages/BuyerOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import CreateStore from './pages/CreateStore';
import StoreView from './pages/StoreView';
import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Explore from './pages/Explore';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Check if splash screen should be shown (only once per session)
  React.useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    const lastSplashTime = localStorage.getItem('lastSplashTime');
    const now = Date.now();
    
    // Check for reset parameter in URL (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const resetSplash = urlParams.get('resetSplash');
    
    if (resetSplash === 'true') {
      // Reset splash screen memory
      sessionStorage.removeItem('hasSeenSplash');
      localStorage.removeItem('lastSplashTime');
      console.log('Splash screen reset - will show on next reload');
    }
    
    // Only show splash if never seen or last seen more than 24 hours ago
    const shouldShowSplash = !hasSeenSplash || (lastSplashTime && (now - parseInt(lastSplashTime)) > 24 * 60 * 60 * 1000);
    
    if (!shouldShowSplash) {
      setShowSplash(false);
      return;
    }
    
    // Safety net: Force hide splash after 2 seconds max (reduced from 4)
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Mark as seen and store timestamp
      sessionStorage.setItem('hasSeenSplash', 'true');
      localStorage.setItem('lastSplashTime', now.toString());
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <StoreProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <Router>
          <Routes>
            {/* Admin Route - Completely Separate */}
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* All other routes - Mobile Layout */}
            <Route path="/*" element={
              <div className={`mobile-container ${showSplash ? 'hidden' : ''}`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                  <Route path="/buyer-orders" element={<BuyerOrders />} />
                  <Route path="/create-store" element={<CreateStore />} />
                  <Route path="/store/:storeId" element={<StoreView />} />
                  <Route path="/manage-products" element={<ProductManagement />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/explore" element={<Explore />} />
                </Routes>
                <Navigation />
              </div>
            } />
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
