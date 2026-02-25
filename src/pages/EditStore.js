import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ArrowLeft, Upload, X, Palette, Store as StoreIcon, Save,
  Eye, EyeOff, CheckCircle, AlertCircle, Image
} from 'lucide-react';

export default function EditStore() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { stores, loading } = useStore();

  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryColor: '#9333ea',
    secondaryColor: '#a855f7',
    logo: '',
    banner: ''
  });
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Color presets
  const colorPresets = [
    { primary: '#9333ea', secondary: '#a855f7', name: 'Purple' },
    { primary: '#3b82f6', secondary: '#60a5fa', name: 'Blue' },
    { primary: '#10b981', secondary: '#34d399', name: 'Green' },
    { primary: '#f59e0b', secondary: '#fbbf24', name: 'Amber' },
    { primary: '#ef4444', secondary: '#f87171', name: 'Red' },
    { primary: '#6366f1', secondary: '#818cf8', name: 'Indigo' },
    { primary: '#ec4899', secondary: '#f472b6', name: 'Pink' },
    { primary: '#14b8a6', secondary: '#2dd4bf', name: 'Teal' }
  ];

  React.useEffect(() => {
    if (!loading && stores.length > 0) {
      const storeData = stores.find(s => s.id === storeId);
      if (storeData) {
        // Check if current user is the owner
        if (storeData.ownerId !== currentUser?.uid) {
          navigate('/store/' + storeId);
          return;
        }
        setStore(storeData);
        setFormData({
          name: storeData.name || '',
          description: storeData.description || '',
          primaryColor: storeData.primaryColor || '#9333ea',
          secondaryColor: storeData.secondaryColor || '#a855f7',
          logo: storeData.logo || '',
          banner: storeData.banner || ''
        });
      } else {
        navigate('/stores');
      }
    }
  }, [storeId, stores, loading, currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleColorChange = (primary, secondary) => {
    setFormData(prev => ({ ...prev, primaryColor: primary, secondaryColor: secondary }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingState(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Store name is required');
      }

      await updateDoc(doc(db, 'stores', storeId), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: formData.logo,
        banner: formData.banner,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Store updated successfully!');
      setTimeout(() => {
        navigate('/store/' + storeId);
      }, 2000);

    } catch (error) {
      console.error('Error updating store:', error);
      setError(error.message || 'Failed to update store');
    } finally {
      setLoadingState(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <StoreIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Store not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` }}
      >
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/store/' + storeId)}
            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-semibold">Edit Store</h1>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          {showPreview ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Store Preview</h3>
              <div 
                className="rounded-lg p-4 text-center"
                style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` }}
              >
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <StoreIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h2 className="text-white font-bold text-lg">{formData.name || 'Store Name'}</h2>
                <p className="text-white/80 text-sm mt-1">{formData.description || 'Store description'}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter store name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your store..."
              />
            </div>
          </div>

          {/* Store Colors */}
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Store Colors</h3>
            
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleColorChange(preset.primary, preset.secondary)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.primaryColor === preset.primary && formData.secondaryColor === preset.secondary
                      ? 'border-purple-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                >
                  <span className="text-white text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store Images */}
          <div className="bg-white rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Store Images</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <StoreIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Square image recommended</p>
                </div>
                {formData.logo && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Banner</label>
              <div className="space-y-2">
                {formData.banner && (
                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, banner: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Image className="w-4 h-4" />
                    <span>Upload Banner</span>
                  </button>
                  <p className="text-xs text-gray-500">Wide image recommended (16:9)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loadingState ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
