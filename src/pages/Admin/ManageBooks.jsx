import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiEdit, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:4002';

const ManageBooks = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBook, setCurrentBook] = useState({
    name: '',
    author: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    rating: '4.5',
    trending: 'no',
    discount: '0'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);

  // Categories for dropdown
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Biography',
    'Self-Help',
    'Business',
    'Fantasy',
    'Mystery',
    'Romance'
  ];

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    // Fetch books
    fetchBooks();
  }, [currentUser, isAdmin, navigate]);

  // Get all books from MongoDB
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/book`);
      setBooks(response.data);
      setFilteredBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
      setLoading(false);
    }
  };

  // Filter books based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(book => 
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
    setCurrentPage(1);
  }, [searchTerm, books]);

  // Save book
  const saveBook = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!currentBook.name || !currentBook.author || !currentBook.price || !currentBook.category || !currentBook.image || !currentBook.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Prepare book data with parsed numeric values
    let bookData = {
      ...currentBook,
      price: parseFloat(currentBook.price),
      originalPrice: currentBook.originalPrice ? parseFloat(currentBook.originalPrice) : parseFloat(currentBook.price),
      rating: parseFloat(currentBook.rating),
      discount: parseInt(currentBook.discount)
    };

    // Update or create book
    if (editMode) {
      try {
        const response = await axios.put(`${API_URL}/book/${currentBook._id}`, bookData);
        const updatedBooks = books.map(book => 
          book._id === currentBook._id ? response.data : book
        );
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        toast.success('Book updated successfully');
      } catch (error) {
        console.error('Error updating book:', error);
        toast.error(error.response?.data?.message || 'Failed to update book');
      }
    } else {
      try {
        // For new books, don't include _id field at all - remove it completely
        const { _id, ...newBookData } = bookData;
        
        const response = await axios.post(`${API_URL}/book`, newBookData);
        const newBook = response.data;
        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        toast.success('Book added successfully');
      } catch (error) {
        console.error('Error adding book:', error);
        toast.error(error.response?.data?.message || 'Failed to add book');
      }
    }

    // Close modal and reset form
    setShowModal(false);
    resetForm();
  };

  // Delete book
  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/book/${id}`);
        const updatedBooks = books.filter(book => book._id !== id);
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        toast.success('Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  // Handle edit button click
  const handleEdit = (book) => {
    setCurrentBook(book);
    setEditMode(true);
    setShowModal(true);
  };

  // Handle add new book button click
  const handleAddNew = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  // Reset the form
  const resetForm = () => {
    setCurrentBook({
      name: '',
      author: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      rating: '4.5',
      trending: 'no',
      discount: '0'
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Books</h1>
          <button
            onClick={handleAddNew}
            className="bg-secondary hover:bg-secondary-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" /> Add New Book
          </button>
        </div>

        {/* Search Box */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author or category"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 text-center text-gray-300">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="p-8 text-center text-gray-300">
              {searchTerm ? 'No books match your search.' : 'No books found. Add your first book!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Image</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Title</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Author</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Category</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Price</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-750">
                      <td className="py-3 px-4">
                        <img 
                          src={book.image} 
                          alt={book.name} 
                          className="w-12 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-white">{book.name}</td>
                      <td className="py-3 px-4 text-gray-300">{book.author}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        ${book.price}
                        {book.originalPrice > book.price && (
                          <span className="text-gray-400 line-through ml-2 text-sm">
                            ${book.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Edit Book"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => deleteBook(book._id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Book"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-lg ${currentPage === 1 ? 'bg-slate-700 text-gray-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                Prev
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 ${currentPage === number + 1 ? 'bg-secondary text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-lg ${currentPage === totalPages ? 'bg-slate-700 text-gray-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Add/Edit Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                {editMode ? 'Edit Book' : 'Add New Book'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-300 mb-1">Book Title*</label>
                  <input
                    type="text"
                    name="name"
                    value={currentBook.name}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter book title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Author*</label>
                  <input
                    type="text"
                    name="author"
                    value={currentBook.author}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter author name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Category*</label>
                  <select
                    name="category"
                    value={currentBook.category}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Price*</label>
                  <input
                    type="number"
                    name="price"
                    value={currentBook.price}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={currentBook.originalPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter original price if discounted"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Discount Percentage</label>
                  <input
                    type="number"
                    name="discount"
                    value={currentBook.discount}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={currentBook.rating}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter rating (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Trending</label>
                  <select
                    name="trending"
                    value={currentBook.trending}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-300 mb-1">Image URL*</label>
                  <input
                    type="text"
                    name="image"
                    value={currentBook.image}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentBook.description}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white h-24"
                    placeholder="Enter book description"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBook}
                  className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-600 flex items-center"
                >
                  <FiCheckCircle className="mr-2" />
                  {editMode ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-gray-300 hover:text-white flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ManageBooks; 