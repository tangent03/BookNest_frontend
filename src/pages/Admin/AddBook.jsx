import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4002';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [bookData, setBookData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    category: '',
    author: '',
    duration: '',
    rating: '4.0',
    trending: 'no'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: name === 'price' || name === 'originalPrice' || name === 'discount' || name === 'rating' 
        ? parseFloat(value) 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate discount if originalPrice is provided and discount is empty
      let formData = { ...bookData };
      
      if (formData.originalPrice && !formData.discount) {
        const discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
        formData.discount = discount;
      }

      const response = await axios.post(`${API_URL}/book`, formData);
      
      if (response.status === 201) {
        toast.success('Book added successfully!');
        // Reset form
        setBookData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          discount: '',
          image: '',
          category: '',
          author: '',
          duration: '',
          rating: '4.0',
          trending: 'no'
        });
      }
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Book Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Name*</label>
            <input
              type="text"
              name="name"
              value={bookData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author*</label>
            <input
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <select
              name="category"
              value={bookData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Horror">Horror</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="Psychology">Psychology</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Cookbooks">Cookbooks</option>
            </select>
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price* ($)</label>
            <input
              type="number"
              name="price"
              value={bookData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
            <input
              type="number"
              name="originalPrice"
              value={bookData.originalPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={bookData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Will be calculated if empty"
            />
          </div>
          
          {/* Duration (Pages) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
            <input
              type="text"
              name="duration"
              value={bookData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 320 pages"
            />
          </div>
          
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={bookData.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Trending */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trending</label>
            <select
              name="trending"
              value={bookData.trending}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          
          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
            <input
              type="url"
              name="image"
              value={bookData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              name="description"
              value={bookData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {loading ? 'Adding...' : 'Add Book'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/books')}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook; 