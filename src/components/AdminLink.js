import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AdminLink() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link
        to="/admin"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-colors"
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">Admin Dashboard</span>
      </Link>
    </div>
  );
}
