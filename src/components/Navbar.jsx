import React, { useEffect, useState } from 'react';
import { FiChevronDown, FiHeart, FiList, FiLogOut, FiMail, FiMenu, FiPackage, FiSettings, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal, { MODAL_TYPES } from './Auth/AuthModal';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalType, setAuthModalType] = useState(MODAL_TYPES.LOGIN);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [wishlistItemCount, setWishlistItemCount] = useState(0);
    const location = useLocation();
    const { currentUser, logout, isAdmin } = useAuth();

    // Get user-specific storage key
    const getStorageKey = (key) => {
        // Make sure we have a user ID from either format
        const userId = currentUser?.id || (currentUser?._id);
        return currentUser ? `${key}_${userId}` : key;
    };

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    // Update cart item count
    useEffect(() => {
        const updateCartCount = () => {
            const cartKey = getStorageKey('cart');
            const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            setCartItemCount(cart.length);
        };

        const updateWishlistCount = () => {
            const wishlistKey = getStorageKey('wishlist');
            const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
            setWishlistItemCount(wishlist.length);
        };

        // Initial count
        updateCartCount();
        updateWishlistCount();

        // Listen for storage events (when cart is updated)
        const handleStorageEvent = () => {
            updateCartCount();
            updateWishlistCount();
        };
        
        window.addEventListener('storage', handleStorageEvent);
        
        // Also listen for custom events dispatched after manual localStorage changes
        window.addEventListener('storageUpdated', handleStorageEvent);
        
        return () => {
            window.removeEventListener('storage', handleStorageEvent);
            window.removeEventListener('storageUpdated', handleStorageEvent);
        };
    }, [currentUser]); // Re-run when user changes

    const handleOpenAuth = (type) => {
        setAuthModalType(type);
        setIsAuthModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    // Navlinks common to all users
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Books', path: '/course' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    // Admin specific links
    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FiSettings /> },
        { name: 'Manage Books', path: '/admin/books', icon: <FiList /> },
        { name: 'Subscribers', path: '/admin/emails', icon: <FiMail /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiPackage /> },
    ];

    // User specific links
    const userLinks = [
        { name: 'My Profile', path: '/profile', icon: <FiUser /> },
        { name: 'My Orders', path: '/profile', icon: <FiPackage /> },
        { name: 'Wishlist', path: '/wishlist', icon: <FiHeart /> },
    ];

    return (
        <>
            <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-white">BookNest</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium hover:text-secondary transition-colors ${
                                        location.pathname === link.path ? 'text-secondary' : 'text-gray-300'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Right Side */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/wishlist" className="relative p-2 text-gray-300 hover:text-red-500 transition-colors" title="Wishlist">
                                <FiHeart size={20} />
                                {wishlistItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {wishlistItemCount}
                                    </span>
                                )}
                            </Link>
                            
                            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-secondary transition-colors" title="Cart">
                                <FiShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {currentUser ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <span className="text-sm font-medium">{currentUser.name}</span>
                                        <FiChevronDown size={16} className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-lg py-1 z-50">
                                            {isAdmin() ? (
                                                // Admin Links
                                                <>
                                                    {adminLinks.map((link) => (
                                                        <Link
                                                            key={link.name}
                                                            to={link.path}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                                                        >
                                                            <span className="mr-2">{link.icon}</span>
                                                            {link.name}
                                                        </Link>
                                                    ))}
                                                </>
                                            ) : (
                                                // Regular User Links
                                                <>
                                                    {userLinks.map((link) => (
                                                        <Link
                                                            key={link.name}
                                                            to={link.path}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                                                        >
                                                            <span className="mr-2">{link.icon}</span>
                                                            {link.name}
                                                        </Link>
                                                    ))}
                                                </>
                                            )}
                                            
                                            {/* Logout - Common to all users */}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                                            >
                                                <FiLogOut className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleOpenAuth(MODAL_TYPES.LOGIN)}
                                    className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-md hover:bg-secondary-600 transition-colors"
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-4">
                            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-secondary transition-colors">
                                <FiShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white focus:outline-none"
                            >
                                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-t border-slate-800 py-2">
                        <div className="px-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block py-2 text-base font-medium ${
                                        location.pathname === link.path ? 'text-secondary' : 'text-gray-300 hover:text-secondary'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {/* User Authentication in Mobile Menu */}
                            {currentUser ? (
                                <>
                                    <div className="pt-2 mt-2 border-t border-slate-800">
                                        <p className="text-white font-medium mb-2">{currentUser.name}</p>
                                        
                                        {isAdmin() ? (
                                            // Admin Links
                                            adminLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    className="flex items-center py-2 text-base text-gray-300 hover:text-secondary"
                                                >
                                                    <span className="mr-2">{link.icon}</span>
                                                    {link.name}
                                                </Link>
                                            ))
                                        ) : (
                                            // Regular User Links
                                            userLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    className="flex items-center py-2 text-base text-gray-300 hover:text-secondary"
                                                >
                                                    <span className="mr-2">{link.icon}</span>
                                                    {link.name}
                                                </Link>
                                            ))
                                        )}
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full py-2 text-base text-red-400 hover:text-red-300"
                                        >
                                            <FiLogOut className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="pt-2 mt-2 border-t border-slate-800 flex flex-col space-y-2">
                                    <button
                                        onClick={() => handleOpenAuth(MODAL_TYPES.LOGIN)}
                                        className="py-2 w-full bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleOpenAuth(MODAL_TYPES.REGISTER)}
                                        className="py-2 w-full border border-secondary text-secondary rounded-md hover:bg-secondary/10 transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialType={authModalType}
            />
        </>
    );
};

export default Navbar;
