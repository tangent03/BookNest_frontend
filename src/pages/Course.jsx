import React, { useState } from 'react';
import { FiArrowDown, FiBook, FiChevronDown, FiChevronUp, FiFilter, FiSearch, FiSliders, FiStar, FiX } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';

const Course = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(50);
  const [rating, setRating] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState({
    categories: true,
    price: true,
    rating: true
  });

  const toggleSection = (section) => {
    setExpandedSection({
      ...expandedSection,
      [section]: !expandedSection[section]
    });
  };

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Business', 'Self-Help'];

  // Dummy data for courses (replace with your actual data)
  const courses = [
    {
      _id: '1',
      name: 'The Art of Programming',
      category: 'Technology',
      price: 29.99,
      originalPrice: 49.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      description: 'Learn the fundamentals of programming with practical examples.',
      trending: 'yes',
      discount: 40
    },
    {
      _id: '2',
      name: 'The History of Science',
      category: 'Science',
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14',
      description: 'Discover the fascinating journey of scientific discovery through the ages.',
      trending: 'no',
      discount: 30
    },
    {
      _id: '3',
      name: 'Business Leadership',
      category: 'Business',
      price: 34.99,
      originalPrice: 59.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      description: 'Learn effective leadership strategies from successful business leaders.',
      trending: 'yes',
      discount: 40
    },
    {
      _id: '4',
      name: 'Mindfulness Meditation',
      category: 'Self-Help',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
      description: 'Develop a mindfulness practice to reduce stress and improve focus.',
      trending: 'no',
      discount: 30
    },
    {
      _id: '5',
      name: 'Ancient Civilizations',
      category: 'History',
      price: 27.99,
      originalPrice: 44.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1563651160348-813cb4232018',
      description: 'Explore the fascinating world of ancient civilizations and their legacy.',
      trending: 'no',
      discount: 35
    },
    {
      _id: '6',
      name: 'The Quantum Universe',
      category: 'Science',
      price: 32.99,
      originalPrice: 54.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
      description: 'Understand the mysteries of quantum physics in an accessible way.',
      trending: 'yes',
      discount: 40
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = course.price <= priceRange;
    const matchesRating = rating === 0 || course.rating >= rating;
    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  // Filter section component
  const FilterSection = ({ mobile = false }) => (
    <div className={`${mobile ? 'block lg:hidden' : 'hidden lg:block'} bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg`}>
      {/* Categories */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection('categories')}
        >
          <h3 className="text-white font-semibold flex items-center">
            <FiBook className="mr-2" /> Categories
          </h3>
          {expandedSection.categories ? 
            <FiChevronUp className="text-gray-400" /> : 
            <FiChevronDown className="text-gray-400" />
          }
        </div>
        
        {expandedSection.categories && (
          <div className="mt-3 space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-secondary/20 text-secondary'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    selectedCategory === category ? 'bg-secondary' : 'bg-slate-700'
                  }`}></span>
                  {category}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection('price')}
        >
          <h3 className="text-white font-semibold flex items-center">
            <FiSliders className="mr-2" /> Price Range
          </h3>
          {expandedSection.price ? 
            <FiChevronUp className="text-gray-400" /> : 
            <FiChevronDown className="text-gray-400" />
          }
        </div>
        
        {expandedSection.price && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>
        )}
      </div>
      
      {/* Rating */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => toggleSection('rating')}
        >
          <h3 className="text-white font-semibold flex items-center">
            <FiStar className="mr-2" /> Rating
          </h3>
          {expandedSection.rating ? 
            <FiChevronUp className="text-gray-400" /> : 
            <FiChevronDown className="text-gray-400" />
          }
        </div>
        
        {expandedSection.rating && (
          <div className="mt-3 space-y-2">
            {[0, 4, 4.5, 5].map(star => (
              <div key={star} className="flex items-center">
                <button
                  onClick={() => setRating(star)}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                    rating === star
                      ? 'bg-secondary/20 text-secondary'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    rating === star ? 'bg-secondary' : 'bg-slate-700'
                  }`}></span>
                  {star === 0 ? 'Any Rating' : `${star}+ Stars`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reset Filters Button */}
      <button 
        onClick={() => {
          setSelectedCategory('All');
          setPriceRange(50);
          setRating(0);
        }}
        className="w-full py-2 border border-slate-700 text-gray-300 rounded-lg hover:border-secondary hover:text-secondary transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore Our Collection</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover a world of knowledge with our carefully curated selection of books across various genres.
          </p>
        </div>

        {/* Mobile Search and Filter Toggle */}
        <div className="lg:hidden mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-800 hover:border-secondary transition-colors"
            >
              <FiFilter className="w-5 h-5 mr-2" />
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showMobileFilters && (
            <div className="mt-4">
              <FilterSection mobile={true} />
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-8 self-start">
            {/* Desktop Search */}
            <div className="hidden lg:block mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Desktop Filters */}
            <FilterSection />
          </div>

          {/* Books Grid */}
          <div className="w-full lg:w-3/4">
            {/* Results Count & Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                <span className="font-medium text-white">{filteredCourses.length}</span> books found
              </p>
              
              <div className="relative inline-block">
                <select className="appearance-none bg-slate-900 border border-slate-800 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <FiArrowDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6">
                  <FiX className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No Books Found</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  We couldn't find any books matching your current filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPriceRange(50);
                    setRating(0);
                  }}
                  className="mt-6 px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredCourses.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-secondary/10 text-secondary border border-secondary/30 rounded-lg font-medium hover:bg-secondary hover:text-white transition-all duration-300">
                  Load More Books
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course; 