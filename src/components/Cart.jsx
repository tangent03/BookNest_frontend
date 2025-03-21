import React, { useEffect, useState } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Cart = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
        calculateTotal(items);
    }, [isOpen]);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    };

    const updateQuantity = (itemId, change) => {
        const updatedItems = cartItems.map(item => {
            if (item._id === itemId) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (itemId) => {
        const updatedItems = cartItems.filter(item => item._id !== itemId);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
    };

    const handleCheckout = () => {
        // Implement checkout logic here
        alert('Proceeding to checkout...');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            
            <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-slate-950 shadow-xl transform transition-transform duration-300">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-300 hover:text-secondary transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-300">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-28 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                            <p className="text-secondary font-semibold mt-1">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="p-1 text-gray-300 hover:text-secondary transition-colors"
                                                >
                                                    <FiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="text-gray-300 w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="p-1 text-gray-300 hover:text-secondary transition-colors"
                                                >
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="ml-auto p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white font-semibold">Total:</span>
                            <span className="text-secondary font-bold text-xl">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className="w-full bg-secondary hover:bg-secondary-600 text-white py-3 rounded-md font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 