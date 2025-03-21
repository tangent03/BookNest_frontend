import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiBookmark, FiFilter, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

// Updated sample books with additional fields to match backend data
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg'
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg'
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg'
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg'
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg'
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
        image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg'
    }
];

// Categories for filter
const categories = [
    'All',
    'Fiction',
    'Classic',
    'Science Fiction',
    'Romance',
    'Fantasy'
];

const Course = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(50);
    const [showFilters, setShowFilters] = useState(false);
    const [featuredBook, setFeaturedBook] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Using environment variable or fallback to the production URL
                const API_URL = import.meta.env.VITE_API_URL || "https://booknest-backend.onrender.com";
                const response = await axios.get(`${API_URL}/book`);
                console.log('API Response:', response.data);
                
                if (response.data && response.data.length > 0) {
                    console.log('Successfully fetched', response.data.length, 'books from MongoDB');
                    setBooks(response.data);
                    
                    // Set a random trending book as featured
                    const trendingBooks = response.data.filter(book => book.trending === 'yes');
                    if (trendingBooks.length > 0) {
                        setFeaturedBook(trendingBooks[Math.floor(Math.random() * trendingBooks.length)]);
                    } else {
                        setFeaturedBook(response.data[0]);
                    }
                } else {
                    console.log('No books found in MongoDB, using sample data');
                    setBooks(sampleBooks);
                    setFeaturedBook(sampleBooks.find(book => book.trending === 'yes') || sampleBooks[0]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching books:', err);
                console.log('Using sample books as fallback due to error');
                setBooks(sampleBooks);
                setFeaturedBook(sampleBooks.find(book => book.trending === 'yes') || sampleBooks[0]);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter books based on search, category, and price
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              book.author?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        const matchesPrice = book.price <= priceRange;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-16">
                <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-300">Loading books...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 pt-16">
                <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-red-500 text-xl">{error}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-secondary hover:bg-secondary-600 text-white px-6 py-2 rounded-md transition duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

  return (
        <div className="min-h-screen bg-slate-950 pt-8">
            {/* Hero Section with Featured Book */}
            {featuredBook && (
                <div className="relative mb-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 to-slate-950/30 z-10"></div>
                    <div className="absolute inset-0">
                        <img 
                            src={featuredBook.image} 
                            alt={featuredBook.name}
                            className="w-full h-full object-cover opacity-40 blur-sm" 
                        />
                    </div>
                    <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-20">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 flex-shrink-0">
                                <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                                    <img 
                                        src={featuredBook.image} 
                                        alt={featuredBook.name} 
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 md:p-8 border border-slate-800">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                        {featuredBook.name}
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-6">
                                        {featuredBook.description}
                                    </p>
                                    <div className="flex items-center text-gray-300 mb-6">
                                        <span className="mr-4">By <span className="text-white font-medium">{featuredBook.author}</span></span>
                                        <span className="mr-4">|</span>
                                        <span className="mr-4">{featuredBook.category}</span>
                                        <span className="mr-4">|</span>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="ml-1">{featuredBook.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div>
                                            <span className="text-3xl font-bold text-white">${featuredBook.price}</span>
                                            {featuredBook.originalPrice && (
                                                <span className="text-lg text-gray-400 line-through ml-2">${featuredBook.originalPrice}</span>
                                            )}
                                        </div>
                                        <Link 
                                            to={`/book/${featuredBook._id}`} 
                                            className="bg-secondary hover:bg-secondary-600 text-white px-8 py-3 rounded-lg font-medium transition duration-300 transform hover:scale-105 flex-shrink-0"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Explore Our Collection
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Discover a world of knowledge and adventure through our carefully curated collection of books
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                placeholder="Search by title, author, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Toggle (Mobile) and View Switcher */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-gray-300 hover:text-white flex items-center justify-center md:hidden"
                            >
                                <FiFilter className="mr-2" />
                                Filters
                            </button>
                            <div className="flex rounded-lg overflow-hidden border border-slate-700">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`px-4 py-3 flex items-center ${view === 'grid' ? 'bg-secondary text-white' : 'bg-slate-900/80 text-gray-400 hover:text-white'}`}
                                >
                                    <FiGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`px-4 py-3 flex items-center ${view === 'list' ? 'bg-secondary text-white' : 'bg-slate-900/80 text-gray-400 hover:text-white'}`}
                                >
                                    <FiList className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters (Mobile - Collapsible) */}
                    <div className={`md:hidden mb-6 transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96' : 'max-h-0'}`}>
                        <div className="p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg">
                            {/* Categories */}
                            <div className="mb-4">
                                <h3 className="text-white font-medium mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                selectedCategory === category 
                                                    ? 'bg-secondary text-white' 
                                                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-white font-medium mb-2">Max Price: ${priceRange}</h3>
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    step="5"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>$10</span>
                                    <span>$50</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Pills (Desktop) */}
                    <div className="hidden md:flex flex-wrap gap-2 mb-8">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === category 
                                        ? 'bg-secondary text-white' 
                                        : 'bg-slate-900/80 backdrop-blur-md border border-slate-700 text-gray-300 hover:bg-slate-800'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Price Range */}
                    <div className="hidden md:block mb-10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-medium">Price Range</h3>
                            <span className="text-secondary font-medium">${priceRange}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>$10</span>
                            <span>$50</span>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-300">
                        Showing <span className="font-medium text-white">{filteredBooks.length}</span> book{filteredBooks.length !== 1 ? 's' : ''}
                        {selectedCategory !== 'All' && <span> in <span className="text-secondary">{selectedCategory}</span></span>}
                    </p>
                </div>

                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                    <div className={`grid gap-6 ${
                        view === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1'
                    }`}>
                        {filteredBooks.map(book => (
                            <div key={book._id}>
                                {view === 'grid' ? (
                                    <CourseCard course={book} />
                                ) : (
                                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row transition-transform hover:-translate-y-1 hover:shadow-xl">
                                        <div className="md:w-1/3 relative">
                                            <img 
                                                src={book.image} 
                                                alt={book.name} 
                                                className="w-full h-64 md:h-full object-cover"
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
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white">{book.name}</h3>
                                                <div className="flex items-center bg-slate-800 px-2 py-1 rounded text-xs">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {book.rating}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-2">By <span className="text-white">{book.author}</span></p>
                                            <p className="text-gray-400 mb-4 flex-grow">{book.description}</p>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-2xl font-bold text-white">${book.price}</span>
                                                    {book.originalPrice && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">${book.originalPrice}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            // Add to wishlist functionality
                                                        }}
                                                        className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
                                                    >
                                                        <FiBookmark className="w-5 h-5" />
                                                    </button>
                                                    <Link 
                                                        to={`/book/${book._id}`} 
                                                        className="px-4 py-2 bg-secondary hover:bg-secondary-600 text-white rounded-lg transition-colors"
                                                    >
                                                        View Details
        </Link>
      </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
                        <div className="text-gray-500 text-5xl mb-4">📚</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No Books Found</h3>
                        <p className="text-gray-300 max-w-md mx-auto mb-6">
                            We couldn't find any books matching your current filters. Try adjusting your search criteria.
                        </p>
                        <button 
                            onClick={() => {
                                setSelectedCategory('All');
                                setSearchQuery('');
                                setPriceRange(50);
                            }}
                            className="px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
      </div>
    </div>
    );
};

export default Course;
