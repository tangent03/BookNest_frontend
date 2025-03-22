import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// Replace process.env with a direct API URL to fix "process is not defined" error
const API_URL = import.meta.env.VITE_API_URL || 'https://booknest-backend.onrender.com'; // Use environment variable or production URL

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminVerified, setAdminVerified] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('adminVerified');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedToken) {
      setToken(storedToken);
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    if (adminStatus) {
      setAdminVerified(JSON.parse(adminStatus));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email }); // Debugging
      
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password
      });
      
      console.log("Login response:", response.data); // Debugging
      
      const userData = {
        id: response.data.user._id,
        name: response.data.user.fullname,
        email: response.data.user.email,
        role: response.data.user.role || (email.includes('admin') ? 'admin' : 'user'),
        passwordLastChanged: response.data.user.passwordLastChanged || new Date().toISOString()
      };
      
      const jwtToken = response.data.token;
      
      // Store user data and token
      setCurrentUser(userData);
      setToken(jwtToken);
      
      // Set token for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific backend error messages
      if (error.response) {
        // The server responded with a status code outside of 2xx range
        const errorMessage = error.response.data.message || 'Invalid email or password';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // For demo purposes - if the backend is not connected, use mock data
      if (!error.response || error.message.includes('Network Error')) {
        console.log('Using mock login data due to backend connection issue');
        const userData = {
          id: '1',
          name: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user',
          passwordLastChanged: new Date().toISOString()
        };
        
        const mockToken = 'mock-jwt-token';
        
        setCurrentUser(userData);
        setToken(mockToken);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', mockToken);
        
        toast.success('Login successful! (Mock data)');
        return userData;
      }
      
      // If no specific error handled above
      toast.error('Login failed. Please try again.');
      throw new Error('Login failed');
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/signup`, {
        fullname: name,
        email,
        password
      });
      
      console.log("Registration response:", response.data); // Debugging
      
      const userData = {
        id: response.data.user._id,
        name: response.data.user.fullname,
        email: response.data.user.email,
        role: 'user'
      };
      
      const jwtToken = response.data.token;
      
      // Store user data and token
      setCurrentUser(userData);
      setToken(jwtToken);
      
      // Set token for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
      
      toast.success('Registration successful!');
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific backend error messages
      if (error.response) {
        // The server responded with a status code outside of 2xx range
        const errorMessage = error.response.data.message || 'Registration failed';
        
        // Check for specific error messages
        if (errorMessage.includes('already exists')) {
          toast.error('User already exists. Please login instead.');
        } else {
          toast.error(errorMessage);
        }
        
        throw new Error(errorMessage);
      }
      
      // For demo purposes - if the backend is not connected, use mock data
      if (!error.response || error.message.includes('Network Error')) {
        console.log('Using mock registration data due to backend connection issue');
        const userData = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user'
        };
        
        const mockToken = 'mock-jwt-token';
        
        setCurrentUser(userData);
        setToken(mockToken);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', mockToken);
        
        toast.success('Registration successful! (Mock data)');
        return userData;
      }
      
      // If no specific error handled above
      toast.error('Registration failed. Please try again.');
      throw new Error('Registration failed');
    }
  };

  // Helper to get user-specific storage keys
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setAdminVerified(false);
    
    // Remove token from future requests
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user-specific data
    const userId = currentUser?.id || currentUser?._id;
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
      localStorage.removeItem(`wishlist_${userId}`);
    }
    
    // Clear general auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminVerified');
    
    // Trigger storage event to update UI components
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Logged out successfully!');
  };

  // Password reset request function
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/user/forgot-password`, { email });
      toast.success(`Password reset link sent to ${email}`);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // For demo purposes - if the backend is not connected, simulate success
      if (!error.response || error.message.includes('Network Error')) {
        console.log('Using mock forgot password due to backend connection issue');
        toast.success(`Password reset link sent to ${email} (Mock)`);
        return { resetSent: true, mockMode: true };
      }
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Reset password with token function
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, { 
        token, 
        newPassword 
      });
      
      // If successful, update user and token
      if (response.data.user && response.data.token) {
        const userData = {
          id: response.data.user._id,
          name: response.data.user.fullname,
          email: response.data.user.email,
          role: response.data.user.role,
          passwordLastChanged: response.data.user.passwordLastChanged
        };
        
        setCurrentUser(userData);
        setToken(response.data.token);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        
        // Set token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      toast.success('Password reset successfully');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      
      // For demo purposes - if the backend is not connected, simulate success
      if (!error.response || error.message.includes('Network Error')) {
        console.log('Using mock reset password due to backend connection issue');
        toast.success('Password reset successfully (Mock)');
        return true;
      }
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!currentUser) throw new Error('You must be logged in to change your password');
      
      // Get user ID
      const userId = currentUser?.id || currentUser?._id;
      
      const response = await axios.put(`${API_URL}/user/change-password`, {
        userId,
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Upon successful password change, update the stored user data
      // with information returned from the backend
      if (response.data.success) {
        const updatedUserData = {
          id: response.data.user._id,
          name: response.data.user.fullname,
          email: response.data.user.email,
          role: response.data.user.role || currentUser.role,
          passwordLastChanged: response.data.user.passwordLastChanged
        };
        
        // Update local state and storage
        setCurrentUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        toast.success('Password updated successfully');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      
      // For demo purposes - if the backend is not connected, simulate success
      if (!error.response || error.message.includes('Network Error')) {
        console.log('Using mock password change due to backend connection issue');
        
        // Even in mock mode, update the stored user data
        const updatedUserData = {
          ...currentUser,
          passwordLastChanged: new Date().toISOString()
        };
        
        setCurrentUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        toast.success('Password updated successfully (Mock)');
        return true;
      }
      
      // Handle incorrect current password
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
        throw new Error('Current password is incorrect');
      }
      
      // Handle other errors
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin' || adminVerified;
  };

  // Set user as admin after validation
  const setAsAdmin = (status) => {
    setAdminVerified(status);
    localStorage.setItem('adminVerified', JSON.stringify(status));
  };

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    adminVerified,
    setAdminVerified,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getStorageKey,
    isAdmin,
    setAsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 