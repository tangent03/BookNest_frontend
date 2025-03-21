import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheck, FiCreditCard, FiLock, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Payment details
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Get user-specific storage key
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  // Load cart from localStorage
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem(getStorageKey('cart')) || '[]');
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    setCart(cartItems);

    // If user is logged in, pre-fill email
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email,
        firstName: currentUser.name.split(' ')[0] || '',
        lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [currentUser, navigate]);

  // Calculate order summary
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      // Validate shipping form
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.zipCode) {
        toast.error('Please fill all the required fields');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate payment form
    if (!formData.cardName || !formData.cardNumber || 
        !formData.cardExpiry || !formData.cardCvc) {
      toast.error('Please fill all the payment details');
      return;
    }

    setLoading(true);
    
    try {
      console.log("Processing order for amount:", total);
      
      // First create a payment record in the backend
      const checkoutResponse = await axios.post(`${API_URL}/api/checkout`, {
        amount: total,
      });

      console.log("Checkout response:", checkoutResponse.data);

      if (checkoutResponse.data.success) {
        // Use the order ID from the checkout response
        const orderId = checkoutResponse.data.order.id;
        
        // Create a mock payment for testing
        const mockPaymentData = {
          razorpay_order_id: orderId,
          razorpay_payment_id: "pay_" + Date.now(),
          razorpay_signature: "sig_" + Date.now()
        };
        
        console.log("Sending payment verification with:", mockPaymentData);
        
        // Verify the payment
        const verificationResponse = await axios.post(`${API_URL}/api/paymentverification`, mockPaymentData);
        console.log("Payment verification response:", verificationResponse.data);
        
        if (verificationResponse.data.success) {
          // Payment was successful, now create the order
          const orderData = await createOrderInSystem(mockPaymentData);
          
          // Navigate to order success page with the order ID
          navigate('/order-success', { state: { orderId: orderData.id } });
        } else {
          toast.error("Payment verification failed");
        }
      } else {
        toast.error("Failed to create payment order");
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Order processing failed:', error);
      
      // Show more specific error message
      if (error.response) {
        toast.error(`Payment error: ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to process your order. Please try again.');
      }
    }
  };

  // Handle creating the order in your system after payment is successful
  const createOrderInSystem = async (paymentResponse) => {
    try {
      console.log("Creating order with payment data:", paymentResponse);
      
      // Create order object
      const newOrder = {
        userId: currentUser?.id || currentUser?._id,
        items: cart,
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        payment: {
          cardLast4: formData.cardNumber.slice(-4),
          razorpay_payment_id: paymentResponse.razorpay_payment_id
        },
        subtotal,
        shippingCost: shipping,
        tax,
        total,
        status: 'Processing',
        date: new Date().toISOString(),
      };

      // Save to localStorage for immediate access
      const orders = JSON.parse(localStorage.getItem(getStorageKey('orders')) || '[]');
      const orderWithId = { ...newOrder, id: Date.now().toString() };
      orders.push(orderWithId);
      localStorage.setItem(getStorageKey('orders'), JSON.stringify(orders));
      
      // Clear cart
      localStorage.setItem(getStorageKey('cart'), JSON.stringify([]));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('storageUpdated'));
      
      // Send to backend to save in MongoDB
      if (currentUser) {
        try {
          // Add authentication token to headers if available
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          
          console.log('Sending order to backend:', newOrder);
          await axios.post(`${API_URL}/orders`, newOrder, { headers });
          console.log('Order saved successfully');
        } catch (error) {
          console.error('Failed to save order to database:', error);
          toast.error('Your order was processed but failed to sync with your account');
        }
      }
      
      return orderWithId;
    } catch (error) {
      console.error('Failed to create order after payment:', error);
      toast.error('Payment was successful but order creation failed');
      return null;
    }
  };

  // Add Razorpay script to the page
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Checkout</h1>

        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 1 ? 'bg-secondary' : 'bg-slate-700'
            }`}>
              <FiShoppingBag className="text-white" />
            </div>
            <div className={`w-24 h-1 ${
              activeStep >= 2 ? 'bg-secondary' : 'bg-slate-700'
            }`}></div>
          </div>

          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 2 ? 'bg-secondary' : 'bg-slate-700'
            }`}>
              <FiCreditCard className="text-white" />
            </div>
            <div className={`w-24 h-1 ${
              activeStep >= 3 ? 'bg-secondary' : 'bg-slate-700'
            }`}></div>
          </div>

          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= 3 ? 'bg-secondary' : 'bg-slate-700'
            }`}>
              <FiCheck className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              {/* Shipping Information */}
              {activeStep === 1 && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Shipping Information</h2>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone*
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                        Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                          State*
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                          ZIP Code*
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Payment Information */}
              {activeStep === 2 && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Payment Information</h2>
                  
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="flex items-center mb-4 text-gray-300 text-sm">
                      <FiLock className="mr-2" /> Your payment information is secure
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">
                        Name on Card*
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                        Card Number*
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300 mb-1">
                          Expiration Date*
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-300 mb-1">
                          CVC*
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="CVC"
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-slate-800 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors disabled:opacity-70"
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center py-2 border-b border-slate-800">
                    <div className="w-12 h-12 bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-white text-sm">{item.name}</h3>
                      <div className="flex justify-between">
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                        <p className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="space-y-2 mb-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 