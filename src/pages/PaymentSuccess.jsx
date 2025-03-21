import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess = () => {
    const [paymentId, setPaymentId] = useState('');
    const { currentUser } = useAuth();
    const location = useLocation();

    // Get user-specific storage key
    const getStorageKey = (key) => {
        // Make sure we have a user ID from either format
        const userId = currentUser?.id || (currentUser?._id);
        return currentUser ? `${key}_${userId}` : key;
    };

    useEffect(() => {
        // Get payment reference from URL query parameter
        const searchParams = new URLSearchParams(location.search);
        const reference = searchParams.get('reference');
        
        if (reference) {
            setPaymentId(reference);
            console.log("Payment successful with reference:", reference);
        }

        // Clear the cart after successful payment using the user-specific key
        localStorage.setItem(getStorageKey('cart'), '[]');
        
        // Trigger storage event to update UI components
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storageUpdated'));
    }, [currentUser, location.search]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-slate-900 dark:to-slate-800 pt-16">
            <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-lg mx-auto text-center">
                    <FiCheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    
                    <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        Payment Successful!
                    </h1>

                    <p className="mt-4 text-gray-500 dark:text-gray-300">
                        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                    </p>

                    {paymentId && (
                        <p className="mt-2 text-gray-400 dark:text-gray-400 text-sm">
                            Transaction ID: {paymentId}
                        </p>
                    )}

                    <div className="mt-8 space-y-4">
                        <Link
                            to="/"
                            className="block w-full px-8 py-3 text-sm font-medium text-white bg-secondary hover:bg-secondary-600 rounded-md shadow transition duration-300"
                        >
                            Continue Shopping
                        </Link>

                        <Link
                            to="/orders"
                            className="block w-full px-8 py-3 text-sm font-medium text-secondary bg-white dark:bg-slate-800 border-2 border-secondary hover:bg-secondary/10 rounded-md shadow transition duration-300"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess; 