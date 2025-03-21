import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sample books for fallback
const sampleBooks = [
    {
        _id: '1',
        name: 'The Great Gatsby',
        description: 'A story of decadence and excess, Gatsby explores the darker aspects of the American Dream.',
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        category: 'Fiction',
        author: 'F. Scott Fitzgerald',
        duration: '6 weeks',
        rating: 4.7,
        trending: 'yes',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
        language: 'English',
        pages: 180
    },
    {
        _id: '2',
        name: 'To Kill a Mockingbird',
        description: "Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South.",
        price: 24.99,
        originalPrice: 32.99,
        discount: 20,
        category: 'Classic',
        author: 'Harper Lee',
        duration: '8 weeks',
        rating: 4.9,
        trending: 'yes',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
        language: 'English',
        pages: 281
    },
    {
        _id: '3',
        name: '1984',
        description: "George Orwell's dystopian masterpiece, a vision of a totalitarian future.",
        price: 19.99,
        originalPrice: 27.99,
        discount: 30,
        category: 'Science Fiction',
        author: 'George Orwell',
        duration: '5 weeks',
        rating: 4.6,
        trending: 'no',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
        language: 'English',
        pages: 328
    },
    {
        _id: '4',
        name: 'Pride and Prejudice',
        description: "Jane Austen's beloved masterpiece of love and marriage in Georgian England.",
        price: 22.99,
        originalPrice: 29.99,
        discount: 15,
        category: 'Romance',
        author: 'Jane Austen',
        duration: '7 weeks',
        rating: 4.8,
        trending: 'yes',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
        language: 'English',
        pages: 279
    },
    {
        _id: '5',
        name: 'The Hobbit',
        description: "J.R.R. Tolkien's timeless classic about Bilbo Baggins' adventures with dwarves and a dragon.",
        price: 27.99,
        originalPrice: 34.99,
        discount: 20,
        category: 'Fantasy',
        author: 'J.R.R. Tolkien',
        duration: '9 weeks',
        rating: 4.8,
        trending: 'yes',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
        language: 'English',
        pages: 304
    },
    {
        _id: '6',
        name: 'The Catcher in the Rye',
        description: "J.D. Salinger's classic novel of teenage angst and alienation.",
        price: 18.99,
        originalPrice: 24.99,
        discount: 20,
        category: 'Fiction',
        author: 'J.D. Salinger',
        duration: '5 weeks',
        rating: 4.2,
        trending: 'no',
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
        language: 'English',
        pages: 234
    }
];

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const { currentUser } = useAuth();
    
    // Get user-specific storage key
    const getStorageKey = (key) => {
        // Make sure we have a user ID from either format
        const userId = currentUser?.id || (currentUser?._id);
        return currentUser ? `${key}_${userId}` : key;
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                // Using environment variable or fallback to the production URL
                const API_URL = import.meta.env.VITE_API_URL || "https://booknest-backend.onrender.com";
                const response = await axios.get(`${API_URL}/book/${id}`);
                if (response.data) {
                    setBook(response.data);
                    setError(null);
                } else {
                    setError('Book not found');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching book:', err);
                // Check if the error is a 404 Not Found
                if (err.response && err.response.status === 404) {
                    setError('Book not found');
                } else {
                    // For other errors, try to use sample data as fallback
                    const sampleBook = sampleBooks.find(book => book._id === id);
                    if (sampleBook) {
                        setBook(sampleBook);
                        setError(null);
                    } else {
                        setError('Book not found');
                    }
                }
                setLoading(false);
            }
        };
        
        // Check if the book is in wishlist
        const checkWishlist = () => {
            const wishlistItems = JSON.parse(localStorage.getItem(getStorageKey('wishlist'))) || [];
            const exists = wishlistItems.some(item => item._id === id);
            setInWishlist(exists);
        };
        
        fetchBook();
        checkWishlist();
        
        // Listen for storage events
        const handleStorageEvent = () => checkWishlist();
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('storageUpdated', handleStorageEvent);
        
        return () => {
            window.removeEventListener('storage', handleStorageEvent);
            window.removeEventListener('storageUpdated', handleStorageEvent);
        };
    }, [id, currentUser]); // Re-run when user changes

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        let cartItems = JSON.parse(localStorage.getItem(getStorageKey('cart'))) || [];
        const existingItemIndex = cartItems.findIndex(item => item._id === book._id);
        
        if (existingItemIndex >= 0) {
            // Update quantity if item exists
            cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + quantity;
        } else {
            // Add new item with quantity
            cartItems.push({
                ...book,
                quantity
            });
        }
        
        localStorage.setItem(getStorageKey('cart'), JSON.stringify(cartItems));
        toast.success(`Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} to cart`);
        
        // Trigger storage events
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storageUpdated'));
    };
    
    const toggleWishlist = () => {
        let wishlistItems = JSON.parse(localStorage.getItem(getStorageKey('wishlist'))) || [];
        
        if (inWishlist) {
            // Remove from wishlist
            wishlistItems = wishlistItems.filter(item => item._id !== book._id);
            localStorage.setItem(getStorageKey('wishlist'), JSON.stringify(wishlistItems));
            setInWishlist(false);
            toast.success('Removed from wishlist');
        } else {
            // Add to wishlist
            wishlistItems.push(book);
            localStorage.setItem(getStorageKey('wishlist'), JSON.stringify(wishlistItems));
            setInWishlist(true);
            toast.success('Added to wishlist');
        }
        
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

    if (error) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center bg-slate-950">
                <div className="max-w-3xl mx-auto bg-slate-900 rounded-lg p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Book not found</h2>
                    <p className="text-gray-300 mb-8">We couldn't find the book you're looking for. It might have been removed or the ID is incorrect.</p>
                    <Link 
                        to="/course" 
                        className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition duration-300"
                    >
                        Browse All Books
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-16">
            <div className="container mx-auto px-4">
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="relative">
                            <img
                                src={book.image}
                                alt={book.name}
                                className="w-full h-auto rounded-lg shadow-xl"
                            />
                            {book.trending === 'yes' && (
                                <div className="absolute top-4 left-4">
                                    <span className="bg-secondary px-3 py-1 rounded-full text-xs text-white font-medium">
                                        Trending
                                    </span>
                                </div>
                            )}
                            {book.discount > 0 && (
                                <div className="absolute top-4 right-4">
                                    <span className="bg-red-500 px-3 py-1 rounded-full text-xs text-white font-medium">
                                        {book.discount}% OFF
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-white">{book.name}</h1>
                            <div className="flex items-center space-x-4 text-gray-300">
                                <span>By <span className="text-white">{book.author}</span></span>
                                <span>•</span>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>{book.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{book.category}</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{book.description}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-white">${book.price}</span>
                                {book.originalPrice && (
                                    <span className="text-xl text-gray-500 line-through">${book.originalPrice}</span>
                                )}
                                {book.discount > 0 && (
                                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm">
                                        Save {book.discount}%
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center">
                                    <label htmlFor="quantity" className="mr-3 text-gray-300">Qty:</label>
                                    <div className="flex rounded-md">
                                        <button 
                                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-md text-white hover:bg-slate-700 transition-colors"
                                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            id="quantity"
                                            min="1"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className="w-12 bg-slate-800 border-y border-slate-700 text-center text-white focus:outline-none"
                                        />
                                        <button 
                                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-r-md text-white hover:bg-slate-700 transition-colors"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center justify-center bg-secondary hover:bg-secondary-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                    >
                                        <FiShoppingCart className="mr-2" /> Add to Cart
                                    </button>
                                    <button
                                        onClick={toggleWishlist}
                                        className={`flex items-center justify-center ${
                                            inWishlist 
                                                ? 'bg-red-500 hover:bg-red-600' 
                                                : 'bg-slate-800 hover:bg-slate-700'
                                        } text-white px-4 py-2 rounded-md font-medium transition-colors`}
                                    >
                                        <FiHeart className={`mr-2 ${inWishlist ? 'fill-current' : ''}`} /> 
                                        {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-800 pt-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Book Details</h2>
                                <div className="grid grid-cols-2 gap-4 text-gray-300">
                                    <div>
                                        <span className="font-medium">Author:</span>
                                        <span className="ml-2">{book.author}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Category:</span>
                                        <span className="ml-2">{book.category}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Pages:</span>
                                        <span className="ml-2">{book.pages || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Language:</span>
                                        <span className="ml-2">{book.language || 'English'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails; 