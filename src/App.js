import React, { useState } from 'react';
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
import CreateStore from './pages/CreateStore';
import StoreView from './pages/StoreView';
import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Explore from './pages/Explore';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Safety net: Force hide splash after 4 seconds max
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <StoreProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <Router>
          <div className={`mobile-container ${showSplash ? 'hidden' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/create-store" element={<CreateStore />} />
              <Route path="/store/:storeId" element={<StoreView />} />
              <Route path="/manage-products" element={<ProductManagement />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/explore" element={<Explore />} />
            </Routes>
            <Navigation />
          </div>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
