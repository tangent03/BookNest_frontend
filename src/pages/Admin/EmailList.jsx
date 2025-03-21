import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiDownload, FiFilter, FiMail, FiRefreshCw, FiSearch, FiTrash2 } from 'react-icons/fi';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const EmailList = () => {
  const { currentUser } = useAuth();
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(15);

  // Fetch emails from MongoDB
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/emails`);
      setEmails(response.data);
      setFilteredEmails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to load email subscribers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...emails];
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        results = results.filter(email => new Date(email.createdAt) >= startDate);
      }
    }
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(email => 
        email.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEmails(results);
    setCurrentPage(1);
  }, [dateFilter, searchTerm, emails]);

  // Handle email deletion
  const handleDeleteEmail = (email) => {
    setSelectedEmail(email);
    setShowDeleteModal(true);
  };

  // Delete email from database
  const deleteEmail = async () => {
    try {
      await axios.delete(`${API_URL}/emails/${selectedEmail._id}`);
      
      const updatedEmails = emails.filter(email => email._id !== selectedEmail._id);
      setEmails(updatedEmails);
      setFilteredEmails(updatedEmails);
      
      toast.success('Email subscriber deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to delete email subscriber');
    }
  };

  // Export emails as CSV
  const exportEmails = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Email,Subscription Date\n' + 
      filteredEmails.map(email => 
        `${email.email},${new Date(email.createdAt).toLocaleDateString()}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'email_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Email list exported successfully');
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Subscribers</h1>
        <p className="text-gray-400">Manage your newsletter subscribers.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Filter */}
          <div className="relative w-full md:w-auto">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48 pl-10 pr-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white appearance-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchEmails}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FiRefreshCw /> Refresh
          </button>
          
          {/* Export Button */}
          <button
            onClick={exportEmails}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        
        {/* Search */}
        <div className="relative w-full lg:w-64">
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Email Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading subscribers...</p>
        </div>
      ) : (
        <>
          {filteredEmails.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No subscribers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentEmails.map((email) => (
                    <tr key={email._id} className="hover:bg-slate-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiMail className="text-gray-400 mr-2" />
                          <div className="text-sm font-medium">{email.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(email.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteEmail(email)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Subscriber"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the subscriber <span className="font-bold text-white">{selectedEmail?.email}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEmail}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList; 