import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerOrders from './pages/BuyerOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CreateStore from './pages/CreateStore';
import StoreView from './pages/StoreView';
import EditStore from './pages/EditStore';
import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Explore from './pages/Explore';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            {/* Admin Route - Completely Separate */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* All other routes - Mobile Layout */}
            <Route path="/*" element={
              <div className="mobile-container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                  <Route path="/buyer-orders" element={<BuyerOrders />} />
                  <Route path="/create-store" element={<CreateStore />} />
                  <Route path="/store/:storeId" element={<StoreView />} />
                  <Route path="/store/:storeId/edit" element={<EditStore />} />
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
