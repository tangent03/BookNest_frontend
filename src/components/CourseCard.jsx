import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsCartDash, BsCartPlus } from 'react-icons/bs';
import { FiClock, FiHeart, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course }) => {
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser } = useAuth();
  
  // Get user-specific storage key
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  useEffect(() => {
    // Check if the course is already in the cart
    const cartItems = JSON.parse(localStorage.getItem(getStorageKey('cart'))) || [];
    const exists = cartItems.some(item => item._id === course._id);
    setInCart(exists);
    
    // Check if the course is in wishlist
    const wishlistItems = JSON.parse(localStorage.getItem(getStorageKey('wishlist'))) || [];
    const inWishlist = wishlistItems.some(item => item._id === course._id);
    setInWishlist(inWishlist);
  }, [course._id, currentUser]); // Re-run when user changes

  const toggleCart = () => {
    let cartItems = JSON.parse(localStorage.getItem(getStorageKey('cart'))) || [];
    
    if (inCart) {
      // Remove from cart
      cartItems = cartItems.filter(item => item._id !== course._id);
      localStorage.setItem(getStorageKey('cart'), JSON.stringify(cartItems));
      setInCart(false);
      toast.success('Removed from cart');
    } else {
      // Add to cart
      cartItems.push({
        ...course,
        quantity: 1 // Add default quantity
      });
      localStorage.setItem(getStorageKey('cart'), JSON.stringify(cartItems));
      setInCart(true);
      toast.success('Added to cart');
    }
    
    // Dispatch both storage event and custom event for components to update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };
  
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure we're not logged in as a guest if we need login
    if (!currentUser) {
      toast.error('Please log in to add to wishlist');
      return;
    }
    
    let wishlistItems = JSON.parse(localStorage.getItem(getStorageKey('wishlist'))) || [];
    
    if (inWishlist) {
      // Remove from wishlist
      wishlistItems = wishlistItems.filter(item => item._id !== course._id);
      localStorage.setItem(getStorageKey('wishlist'), JSON.stringify(wishlistItems));
      setInWishlist(false);
      toast.success('Removed from wishlist');
    } else {
      // Add to wishlist
      wishlistItems.push(course);
      localStorage.setItem(getStorageKey('wishlist'), JSON.stringify(wishlistItems));
      setInWishlist(true);
      toast.success('Added to wishlist');
    }
    
    // Dispatch both storage event and custom event for components to update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  return (
    <div 
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl transition-all transform hover:-translate-y-2 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image */}
        <img 
          src={course.image} 
          alt={course.name} 
          className="w-full h-52 object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            <FiTag className="mr-1" />
            {course.category}
          </div>
        </div>
        
        {/* Price/Discount Badge */}
        {course.discount > 0 && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {course.discount}% OFF
            </span>
          </div>
        )}
        
        {/* Trending Badge */}
        {course.trending === 'yes' && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
              Trending
            </span>
          </div>
        )}
        
        {/* Wishlist button - Moved to bottom right */}
        <button
          onClick={toggleWishlist}
          className={`absolute bottom-4 right-4 p-2.5 rounded-full ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-800/90 text-white hover:bg-red-500/80'
          } shadow-lg transition-all duration-200 hover:scale-110 z-30`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Hover Overlay with Add to Cart */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } z-10`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCart();
            }}
            className={`${
              inCart 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-secondary hover:bg-secondary-600'
            } text-white px-6 py-2 rounded-full flex items-center font-medium transition-transform duration-300 transform hover:scale-105 shadow-lg`}
          >
            {inCart ? (
              <>
                <BsCartDash className="mr-2" /> Remove from Cart
              </>
            ) : (
              <>
                <BsCartPlus className="mr-2" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Course Info */}
      <div className="p-5">
        {/* Meta Information */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{course.duration || '5 weeks'}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{course.rating || '4.5'}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {course.name}
        </h3>
        
        {/* Author */}
        {course.author && (
          <p className="text-sm text-gray-300 mb-2">
            By <span className="text-white">{course.author}</span>
          </p>
        )}
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Price and View Details */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-white">${course.price}</span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${course.originalPrice}
              </span>
            )}
          </div>
          
          <Link 
            to={`/book/${course._id}`}
            className="text-secondary hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 