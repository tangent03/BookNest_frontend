import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiMail, FiMessageSquare, FiUser } from 'react-icons/fi';
import API_URL from '../config/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_URL}/contact/send`, formData);
            
            if (response.status === 200) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-slate-800">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Name"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Email"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Message Subject"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3">
                                        <FiMessageSquare className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your Message"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-secondary hover:bg-secondary-600 text-white font-medium px-8 py-3 rounded-md transition duration-300 transform hover:scale-105 hover:shadow-lg ${
                                        loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800 text-center">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiMail className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="text-white font-medium mb-2">Email</h3>
                            <p className="text-gray-300">support@booknest.com</p>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800 text-center">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-2">Phone</h3>
                            <p className="text-gray-300">+1 (555) 123-4567</p>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800 text-center">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-2">Location</h3>
                            <p className="text-gray-300">123 Book Street, Reading City</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact; 