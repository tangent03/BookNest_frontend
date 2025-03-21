import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsCartPlus, BsTrash } from 'react-icons/bs';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Get the storage key with user prefix if logged in
  const getStorageKey = (key) => {
    // Make sure we have a user ID from either format
    const userId = currentUser?.id || (currentUser?._id);
    return currentUser ? `${key}_${userId}` : key;
  };

  useEffect(() => {
    loadWishlistItems();
    
    // Listen for storage events to update wishlist when items are added/removed
    const handleStorageEvent = () => loadWishlistItems();
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storageUpdated', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('storageUpdated', handleStorageEvent);
    };
  }, [currentUser]); // Re-run when user changes

  const loadWishlistItems = () => {
    const items = JSON.parse(localStorage.getItem(getStorageKey('wishlist'))) || [];
    setWishlistItems(items);
    setLoading(false);
  };

  const removeFromWishlist = (id) => {
    const updatedItems = wishlistItems.filter(item => item._id !== id);
    localStorage.setItem(getStorageKey('wishlist'), JSON.stringify(updatedItems));
    setWishlistItems(updatedItems);
    toast.success('Removed from wishlist');
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  const addToCart = (book) => {
    let cartItems = JSON.parse(localStorage.getItem(getStorageKey('cart'))) || [];
    const exists = cartItems.some(item => item._id === book._id);
    
    if (!exists) {
      cartItems.push({
        ...book,
        quantity: 1 // Add default quantity
      });
      localStorage.setItem(getStorageKey('cart'), JSON.stringify(cartItems));
      toast.success('Added to cart');
    } else {
      toast.error('Already in cart');
    }
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  const clearWishlist = () => {
    localStorage.setItem(getStorageKey('wishlist'), JSON.stringify([]));
    setWishlistItems([]);
    toast.success('Wishlist cleared');
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FiHeart className="mr-3 text-red-500" /> My Wishlist
          </h1>
          {wishlistItems.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(item => (
              <div key={item._id} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                  />
                  {item.trending === 'yes' && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
                        Trending
                      </span>
                    </div>
                  )}
                  {item.discount > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {item.discount}% OFF
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-4 left-4 p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <BsTrash className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  {item.author && (
                    <p className="text-sm text-gray-300 mb-2">
                      By <span className="text-white">{item.author}</span>
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-white">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/book/${item._id}`}
                        className="text-secondary hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(item)}
                        className="text-secondary hover:text-white transition-colors ml-4"
                      >
                        <BsCartPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-gray-500 text-5xl mb-4">💔</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-300 max-w-md mx-auto mb-6">
              Browse our collection and add items to your wishlist to save them for later.
            </p>
            <Link 
              to="/course"
              className="px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 