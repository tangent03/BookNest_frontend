import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiCreditCard, FiInfo, FiShield, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal, { MODAL_TYPES } from '../components/Auth/AuthModal';
import CartItem from '../components/Cart/CartItem';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Get user-specific storage key
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem(getStorageKey('cart')) || '[]');
      setCartItems(cart);
    };

    loadCart();

    // Listen for storage changes
    const handleStorageEvent = () => loadCart();
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storageUpdated', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storageUpdated', handleStorageEvent);
    };
  }, [currentUser]); // Re-run when user changes

  // Update quantity of an item
  const handleUpdateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantity } : item
    );
    
    localStorage.setItem(getStorageKey('cart'), JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  // Remove an item from cart
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    localStorage.setItem(getStorageKey('cart'), JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    toast.success('Item removed from cart');
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  // Clear the entire cart
  const handleClearCart = () => {
    localStorage.setItem(getStorageKey('cart'), JSON.stringify([]));
    setCartItems([]);
    toast.success('Cart cleared');
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );

  // Calculate shipping (free over $50)
  const shipping = subtotal > 50 ? 0 : 5.99;

  // Calculate tax (mock 7%)
  const tax = subtotal * 0.07;

  // Calculate total
  const total = subtotal + shipping + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    // Proceed to checkout
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/checkout');
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 mb-6">
              <FiShoppingBag className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              Looks like you haven't added anything to your cart yet. Explore our collection and find your next favorite book!
            </p>
            <Link
              to="/course"
              className="px-8 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-600 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <Link to="/course" className="flex items-center text-gray-300 hover:text-secondary transition-colors">
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-medium">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                  </p>
                  <button
                    onClick={handleClearCart}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-1">
                  {cartItems.map(item => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <p className="text-gray-300">Subtotal</p>
                  <p className="text-white">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-300">Shipping</p>
                  <p className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-300">Tax</p>
                  <p className="text-white">${tax.toFixed(2)}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between">
                  <p className="text-white font-bold">Total</p>
                  <p className="text-secondary font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              {/* Trust badges */}
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-400">
                    <FiShield className="mr-1" />
                    <span className="text-xs">Secure Payment</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiTruck className="mr-1" />
                    <span className="text-xs">Fast Delivery</span>
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <FiCreditCard className="text-gray-400" />
                  <FiInfo className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialType={MODAL_TYPES.LOGIN}
      />
    </div>
  );
};

export default Cart; 