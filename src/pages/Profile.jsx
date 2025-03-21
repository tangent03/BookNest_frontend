import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiKey, FiLogOut, FiPackage, FiUser } from 'react-icons/fi';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const { currentUser, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!passwordForm.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (!passwordForm.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      // Reset form on success
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show clear success message
      toast.success('Your password has been successfully updated. Please use your new password for future logins.');
    } catch (error) {
      console.error('Failed to change password', error);
      // Error is already shown in the changePassword function
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user-specific storage key
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  useEffect(() => {
    // Load orders from localStorage using user-specific key
    const storedOrders = JSON.parse(localStorage.getItem(getStorageKey('orders')) || '[]');
    setOrders(storedOrders);
  }, [currentUser]);

  // If not logged in, redirect to home
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              {/* User Info */}
              <div className="flex items-center mb-6 pb-6 border-b border-slate-800">
                <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <FiUser className="text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-white font-medium">{currentUser.name || 'User'}</p>
                  <p className="text-gray-300 text-sm">{currentUser.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-slate-800 text-white' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FiPackage className="mr-3" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'account' 
                      ? 'bg-slate-800 text-white' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FiEdit2 className="mr-3" />
                  Account Details
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'password' 
                      ? 'bg-slate-800 text-white' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FiKey className="mr-3" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-gray-500 text-5xl mb-4">
                        <FiPackage className="inline-block" />
                      </div>
                      <p className="text-gray-300 mb-4">You haven't placed any orders yet.</p>
                      <Link 
                        to="/courses" 
                        className="px-6 py-2 bg-secondary text-white rounded-md inline-block hover:bg-secondary-600 transition-colors"
                      >
                        Browse Books
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border border-slate-800 rounded-lg overflow-hidden">
                          <div className="bg-slate-800 px-4 py-3 flex flex-wrap gap-4 justify-between">
                            <div>
                              <p className="text-xs text-gray-400">Order ID</p>
                              <p className="text-white font-mono">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Date</p>
                              <p className="text-white">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total</p>
                              <p className="text-white">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Status</p>
                              <p className="text-secondary">{order.status}</p>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="text-white font-medium mb-3">Items</h3>
                            <div className="space-y-3">
                              {order.items.map(item => (
                                <div key={item._id} className="flex items-center">
                                  <div className="w-10 h-10 bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-3 flex-grow">
                                    <p className="text-white text-sm">{item.name}</p>
                                    <div className="flex justify-between">
                                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                      <p className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Account Details Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          defaultValue={currentUser.name?.split(' ')[0] || ''}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          defaultValue={currentUser.name?.split(' ').slice(1).join(' ') || ''}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={currentUser.email}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                  <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Enter new password (min 6 characters)"
                        minLength={6}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Confirm your new password"
                        minLength={6}
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 ${isSubmitting ? 'bg-gray-600' : 'bg-secondary hover:bg-secondary-600'} text-white rounded-md transition-colors flex items-center justify-center`}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 