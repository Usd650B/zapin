import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Flag, 
  BarChart3, 
  Package, 
  DollarSign,
  UserCheck,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, userType, logout } = useAuth();
  const { users, stores, orders, products } = useStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('AdminDashboard component loaded. Current user:', currentUser?.email);
  console.log('Current path:', window.location.pathname);

  // Admin authentication check
  useEffect(() => {
    console.log('Admin auth check running...');
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      navigate('/login');
      return;
    }

    // If authenticated but not an admin, redirect to appropriate dashboard
    if (userType && userType !== 'admin') {
      console.log(`User is not admin (type=${userType}), redirecting away from admin`);
      if (userType === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/buyer-dashboard');
      }
      return;
    }

    console.log('User authenticated as admin, allowing admin access');
  }, [currentUser, userType, navigate]);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const stats = {
    totalUsers: users?.length || 0,
    totalStores: stores?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
    pendingStores: stores?.filter(store => store.status === 'pending').length || 0,
    activeUsers: users?.filter(user => user.lastActive && 
      new Date(user.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0
  };

  const renderContent = () => {
    console.log('AdminDashboard renderContent called, activeSection:', activeSection);
    console.log('Data available:', { users: users?.length, stores: stores?.length, orders: orders?.length });
    console.log('Stats:', stats);
    
    switch (activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} />;
      case 'users':
        return <UsersSection users={users} />;
      case 'stores':
        return <StoresSection stores={stores} />;
      case 'orders':
        return <OrdersSection orders={orders} />;
      case 'disputes':
        return <DisputesSection orders={orders} users={users} stores={stores} />;
      case 'products':
        return <ProductsSection products={products} />;
      case 'analytics':
        return <AnalyticsSection stats={stats} orders={orders} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col min-h-screen`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-700 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">Admin</h1>
                  <p className="text-xs text-gray-500 truncate">Zapin Control</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3 py-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-50 text-purple-600 border border-purple-200'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h2>
                  <p className="text-sm text-gray-500">
                    {sidebarItems.find(item => item.id === activeSection)?.label} Management
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {!users && !stores && !orders ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading admin dashboard...</p>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Overview Section Component
function OverviewSection({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalStores}</h3>
          <p className="text-sm text-gray-500">Total Stores</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+24%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New store approved</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">5 new users registered</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Store pending approval</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors text-sm font-medium">
              Approve Stores
            </button>
            <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium">
              View Reports
            </button>
            <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
              Export Data
            </button>
            <button className="p-3 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-colors text-sm font-medium">
              System Health
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Section Component
function UsersSection({ users }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.userType === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  const userStats = {
    total: users?.length || 0,
    buyers: users?.filter(u => u.userType === 'buyer').length || 0,
    sellers: users?.filter(u => u.userType === 'seller').length || 0,
    admins: users?.filter(u => u.userType === 'admin').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{userStats.buyers}</p>
              <p className="text-sm text-gray-500">Buyers</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">{userStats.sellers}</p>
              <p className="text-sm text-gray-500">Sellers</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{userStats.admins}</p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
              </select>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                Add User
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.userType === 'admin' ? 'bg-red-50 text-red-600' :
                      user.userType === 'seller' ? 'bg-purple-50 text-purple-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {user.userType || 'buyer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive ? 
                      new Date(user.lastActive.seconds * 1000).toLocaleDateString() : 
                      'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt?.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stores Section Component
function StoresSection({ stores }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Stores</h3>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Export
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Add Store
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">Store management interface coming soon...</p>
      </div>
    </div>
  );
}

// Orders Section Component
function OrdersSection({ orders }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            Export Orders
          </button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">Order management interface coming soon...</p>
      </div>
    </div>
  );
}

// Products Section Component
function ProductsSection({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">Product management interface coming soon...</p>
      </div>
    </div>
  );
}

// Analytics Section Component
function AnalyticsSection({ stats, orders }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Revenue chart coming soon...</p>
        </div>
      </div>
    </div>
  );
}

// Disputes Section Component
function DisputesSection({ orders, users, stores }) {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { updateOrder } = useStore();

  // Filter orders with disputes (cancelled orders where buyer claimed not received)
  const disputedOrders = orders?.filter(order => 
    order.status === 'cancelled' && 
    order.buyerClaimed === true && 
    order.buyerReceived === false
  ) || [];

  const handleResolveDispute = async (orderId, resolution) => {
    if (!resolutionNotes.trim()) {
      alert('Please add resolution notes before resolving the dispute.');
      return;
    }

    try {
      await updateOrder(orderId, {
        disputeResolved: true,
        disputeResolution: resolution,
        disputeNotes: resolutionNotes,
        disputeResolvedAt: new Date().toISOString(),
        disputeResolvedBy: 'admin'
      });

      alert(`Dispute resolved: ${resolution}`);
      setSelectedDispute(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Failed to resolve dispute. Please try again.');
    }
  };

  const getUserInfo = (userId) => {
    return users?.find(user => user.id === userId) || { name: 'Unknown User', email: 'N/A' };
  };

  const getStoreInfo = (storeId) => {
    return stores?.find(store => store.id === storeId) || { name: 'Unknown Store' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dispute Resolution</h3>
              <p className="text-sm text-gray-500">Manage and resolve buyer-seller disputes</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                {disputedOrders.length} Active Disputes
              </span>
            </div>
          </div>
        </div>

        {disputedOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Disputes</h3>
            <p className="text-gray-500">All disputes have been resolved. Great work!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {disputedOrders.map((order) => {
              const buyer = getUserInfo(order.customerId);
              const store = getStoreInfo(order.storeId);
              const isSelected = selectedDispute?.id === order.id;

              return (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                          DISPUTE
                        </span>
                        <span className="text-sm text-gray-500">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Buyer Information</h4>
                          <p className="text-sm text-blue-700">{buyer.name || buyer.email}</p>
                          <p className="text-xs text-blue-600">{buyer.email}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-blue-800">Claim:</span>
                            <p className="text-sm text-blue-700">"Product not received"</p>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-medium text-purple-900 mb-2">Seller Information</h4>
                          <p className="text-sm text-purple-700">{store.name}</p>
                          <p className="text-xs text-purple-600">Store ID: {order.storeId.slice(-6)}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-purple-800">Order Total:</span>
                            <p className="text-sm font-medium text-purple-700">${order.total}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{item.name} x {item.quantity}</span>
                              <span className="text-gray-900 font-medium">${item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-yellow-900 mb-3">Resolution Actions</h4>
                          <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Enter resolution notes..."
                            className="w-full p-3 border border-yellow-300 rounded-lg text-sm resize-none"
                            rows="3"
                          />
                          <div className="flex space-x-3 mt-3">
                            <button
                              onClick={() => handleResolveDispute(order.id, 'Refund to buyer')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Refund to Buyer
                            </button>
                            <button
                              onClick={() => handleResolveDispute(order.id, 'Release funds to seller')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Release to Seller
                            </button>
                            <button
                              onClick={() => handleResolveDispute(order.id, 'Split payment')}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                            >
                              Split Payment
                            </button>
                            <button
                              onClick={() => handleResolveDispute(order.id, 'Investigate further')}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                              Investigate Further
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => setSelectedDispute(isSelected ? null : order)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {isSelected ? 'Close' : 'Resolve'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
      <p className="text-gray-500 text-center py-8">Settings interface coming soon...</p>
    </div>
  );
}
