import React, { useEffect, useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const { currentUser } = useAuth();

  // Get user-specific storage key
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  useEffect(() => {
    // Redirect to home if no orderId is provided
    if (!orderId) {
      navigate('/');
      return;
    }

    // Get order from localStorage using user-specific key
    const orders = JSON.parse(localStorage.getItem(getStorageKey('orders')) || '[]');
    const foundOrder = orders.find(order => order.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      navigate('/');
    }
  }, [orderId, navigate, currentUser]);

  if (!order) {
    return null;
  }

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-screen-md mx-auto px-4">
        {/* Success Message */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 mb-8 text-center">
          <div className="inline-block p-4 bg-green-900/30 rounded-full mb-6">
            <FiCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-300 mb-6">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          <div className="py-4 px-6 bg-slate-800 rounded-lg inline-block">
            <p className="text-gray-300">Order ID: <span className="text-white font-mono">{order.id}</span></p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between pb-4 border-b border-slate-800">
              <p className="text-gray-300">Order Date</p>
              <p className="text-white">{formattedDate}</p>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-800">
              <p className="text-gray-300">Status</p>
              <p className="text-secondary">{order.status}</p>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-800">
              <p className="text-gray-300">Payment</p>
              <p className="text-white">Card ending in {order.payment.cardLast4}</p>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-800">
              <p className="text-gray-300">Shipping Address</p>
              <div className="text-right">
                <p className="text-white">{order.shipping.firstName} {order.shipping.lastName}</p>
                <p className="text-gray-300">{order.shipping.address}</p>
                <p className="text-gray-300">{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="text-lg font-medium text-white mb-3">Ordered Items</h3>
          <div className="space-y-3 mb-6">
            {order.items.map(item => (
              <div key={item._id} className="flex items-center p-3 bg-slate-800 rounded-lg">
                <div className="w-14 h-14 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-white">{item.name}</h4>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between text-lg font-bold">
              <p className="text-white">Total</p>
              <p className="text-secondary">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <FiShoppingBag className="mr-2" /> Continue Shopping
          </Link>
          <Link 
            to="/profile" 
            className="px-6 py-3 bg-secondary hover:bg-secondary-600 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            View Order History <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 