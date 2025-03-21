import React, { useState } from 'react';
import { FiArrowLeft, FiMail, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is handled by toast in context
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-6 md:p-8">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-gray-300 mt-1">
              {success 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>
          
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary-600 text-white py-2.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-gray-300 mb-4">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please check your inbox and follow the instructions to reset your password.
              </p>
              <button
                onClick={() => {
                  setEmail('');
                  setSuccess(false);
                  onSwitchToLogin();
                }}
                className="inline-flex items-center text-secondary hover:text-secondary-400 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Back to login
              </button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Remember your password?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-secondary hover:text-secondary-400 font-medium transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal; 