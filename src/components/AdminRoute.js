import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser, userType } = useAuth();

  // Not logged in -> send to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // Logged-in but not admin -> redirect to appropriate dashboard
  if (userType && userType !== 'admin') {
    if (userType === 'seller') return <Navigate to="/seller-dashboard" replace />;
    return <Navigate to="/buyer-dashboard" replace />;
  }

  // Admin user -> allow access
  return children;
}
