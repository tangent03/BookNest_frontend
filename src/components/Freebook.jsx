import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheck, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

const Freebook = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            console.log('Sending subscription request for:', email);
            const response = await axios.post(`${API_URL}/send-email`, {
                email,
                subject: 'Welcome to BookStore Newsletter!',
                message: 'Thank you for subscribing to our newsletter! We will keep you updated with the latest books, promotions, and exclusive offers.'
            });
            
            console.log('Subscription response:', response.data);
            
            // Email was successfully saved to the database
            if (response.data.emailSaved || response.data.success) {
                if (response.data.alreadySubscribed) {
                    toast.success('This email is already subscribed to our newsletter!');
                } else {
                    toast.success('Your email has been successfully added to our newsletter!');
                }
                setEmail('');
                setSubscriptionSuccess(true);
                
                // Reset success message after 10 seconds
                setTimeout(() => {
                    setSubscriptionSuccess(false);
                }, 10000);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            
            // Check if we have a response from the server
            if (error.response) {
                const errorMsg = error.response.data.error || 'Failed to subscribe. Please try again later.';
                console.error('Server error response:', errorMsg);
                toast.error(errorMsg);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from server');
                toast.error('Cannot connect to the server. Please try again later.');
            } else {
                // Something happened in setting up the request
                console.error('Request setup error:', error.message);
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-950 py-16">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Featured Free Books
                    </h2>
                    <p className="text-lg text-gray-300">
                        Start your reading journey with our selection of free books
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Book Card 1 */}
                    <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-800 group hover:border-secondary transition-colors duration-300">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">📖</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-2">
                                The Great Adventure
                            </h3>
                            <p className="text-gray-300 text-center mb-4">
                                An epic journey through magical realms and mysterious lands.
                            </p>
                            <div className="flex justify-center">
                                <Link
                                    to="/course"
                                    className="bg-secondary hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition duration-300 transform hover:scale-105"
                                >
                                    Read Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Book Card 2 */}
                    <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-800 group hover:border-secondary transition-colors duration-300">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🔮</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-2">
                                Mysteries of the Mind
                            </h3>
                            <p className="text-gray-300 text-center mb-4">
                                Explore the depths of human consciousness and beyond.
                            </p>
                            <div className="flex justify-center">
                                <Link
                                    to="/course"
                                    className="bg-secondary hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition duration-300 transform hover:scale-105"
                                >
                                    Read Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Book Card 3 */}
                    <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-800 group hover:border-secondary transition-colors duration-300">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🌟</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-2">
                                The Art of Living
                            </h3>
                            <p className="text-gray-300 text-center mb-4">
                                A guide to finding balance and happiness in modern life.
                            </p>
                            <div className="flex justify-center">
                                <Link
                                    to="/course"
                                    className="bg-secondary hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition duration-300 transform hover:scale-105"
                                >
                                    Read Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-16 bg-slate-900 rounded-lg shadow-xl p-8 border border-slate-800">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                            <FiMail className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Subscribe to Our Newsletter
                        </h3>
                        <p className="text-gray-300 max-w-lg mx-auto">
                            Get notified about new book releases, free e-books, and exclusive offers delivered straight to your inbox.
                        </p>
                    </div>
                    
                    {subscriptionSuccess ? (
                        <div className="max-w-lg mx-auto text-center">
                            <div className="bg-green-900/30 text-green-400 p-4 rounded-md">
                                <div className="flex items-center justify-center mb-2">
                                    <FiCheck className="mr-2" />
                                    <span className="font-medium">Thank you for subscribing!</span>
                                </div>
                                <p className="text-sm">
                                    We've sent a confirmation email to your inbox. You'll start receiving our latest book updates and special offers soon.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-3 bg-secondary hover:bg-secondary-600 text-white font-medium rounded-md transition duration-300 ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                                }`}
                            >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    )}
                    
                    <div className="text-center mt-4 text-gray-400 text-sm">
                        <p>We respect your privacy. Unsubscribe at any time.</p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/course"
                        className="inline-flex items-center text-secondary hover:text-secondary-600 font-medium group"
                    >
                        View All Free Books
                        <svg
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Freebook;
