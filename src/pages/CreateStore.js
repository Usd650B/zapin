import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Store, ArrowLeft, Upload, X, Palette, Grid, List } from 'lucide-react';

export default function CreateStore() {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [layout, setLayout] = useState('grid');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { currentUser, userType } = useAuth();
  const { addStore } = useStore();
  const navigate = useNavigate();

  // Redirect buyers away from store creation
  useEffect(() => {
    if (currentUser && userType === 'buyer') {
      navigate('/explore');
    }
  }, [currentUser, userType, navigate]);

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Food & Beverages',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Automotive',
    'Other'
  ];

  const colorThemes = [
    { primary: '#3b82f6', secondary: '#10b981', name: 'Ocean' },
    { primary: '#8b5cf6', secondary: '#ec4899', name: 'Purple' },
    { primary: '#ef4444', secondary: '#f59e0b', name: 'Sunset' },
    { primary: '#10b981', secondary: '#3b82f6', name: 'Forest' },
    { primary: '#f59e0b', secondary: '#ef4444', name: 'Autumn' },
    { primary: '#6366f1', secondary: '#8b5cf6', name: 'Galaxy' },
    { primary: '#14b8a6', secondary: '#06b6d4', name: 'Teal' },
    { primary: '#f97316', secondary: '#ea580c', name: 'Orange' }
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!storeName || !description || !category) {
      return alert('Please fill in all required fields');
    }

    setLoading(true);
    
    try {
      const newStore = {
        name: storeName,
        description,
        category,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        logo,
        primaryColor,
        secondaryColor,
        layout,
        isActive: true
      };
      
      addStore(newStore);
      navigate('/seller-dashboard');
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Failed to create store. Please try again.');
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/seller-dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="text-center">
          <Store className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Store</h1>
          <p className="text-gray-600">Set up your online store with custom branding</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your store name"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be visible to customers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe what your store offers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Store Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Logo
            </label>
            <div className="space-y-3">
              {!logo ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img
                      src={logo}
                      alt="Store logo"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Logo uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Color Theme
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorThemes.map((theme, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(theme.primary);
                    setSecondaryColor(theme.secondary);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    primaryColor === theme.primary && secondaryColor === theme.secondary
                      ? 'border-gray-900 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex space-x-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                  <p className="text-xs text-gray-700">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Layout
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  layout === 'grid'
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Grid className="w-6 h-6 mb-1" />
                <span className="text-sm">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  layout === 'list'
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <List className="w-6 h-6 mb-1" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Store Preview</h3>
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-12 h-12 object-cover rounded-lg" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{storeName || 'Store Name'}</h4>
                  <p className="text-sm text-gray-600">{description || 'Store description'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <div
                  className="h-8 flex-1 rounded"
                  style={{ backgroundColor: primaryColor }}
                />
                <div
                  className="h-8 flex-1 rounded"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
