import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiCheck, FiEye, FiFilter, FiSearch, FiTruck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config/api';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    // Fetch orders
    fetchOrders();
  }, [currentUser, isAdmin, navigate]);

  // Fetch orders from MongoDB
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let results = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(order => order.status === statusFilter);
    }
    
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
        results = results.filter(order => new Date(order.createdAt) >= startDate);
      }
    }
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(results);
    setCurrentPage(1);
  }, [statusFilter, dateFilter, searchTerm, orders]);

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}`, {
        status: newStatus
      });
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders.filter(order => 
        statusFilter === 'all' || order.status === statusFilter
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-600 text-yellow-100';
      case 'shipped':
        return 'bg-blue-600 text-blue-100';
      case 'delivered':
        return 'bg-green-600 text-green-100';
      case 'cancelled':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <div className="flex space-x-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 appearance-none pr-8"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FiFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-10 py-2 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
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
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 text-center text-gray-300">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-300">
              {searchTerm || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Order ID</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Customer</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" /> Date
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Items</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Total</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-750">
                      <td className="py-3 px-4 text-white font-medium">{order.orderId || order._id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white">{order.shipping?.firstName} {order.shipping?.lastName || ''}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4 text-gray-300">{order.items?.length || 0} items</td>
                      <td className="py-3 px-4 text-white font-medium">${(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-400 hover:text-blue-300"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          {order.status !== 'shipped' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              className="text-blue-400 hover:text-blue-300"
                              title="Mark as Shipped"
                            >
                              <FiTruck size={18} />
                            </button>
                          )}
                          {order.status !== 'delivered' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              className="text-green-400 hover:text-green-300"
                              title="Mark as Delivered"
                            >
                              <FiCheck size={18} />
                            </button>
                          )}
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

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Order Information</h4>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Order ID:</span> {selectedOrder.orderId || selectedOrder._id}</p>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p className="text-gray-300 mb-1">
                    <span className="text-gray-500">Status:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs 
                      ${selectedOrder.status === 'delivered' ? 'bg-green-600 text-green-100' : 
                        selectedOrder.status === 'shipped' ? 'bg-blue-600 text-blue-100' : 
                        selectedOrder.status === 'processing' ? 'bg-yellow-600 text-yellow-100' : 
                        selectedOrder.status === 'cancelled' ? 'bg-red-600 text-red-100' : 
                        'bg-purple-600 text-purple-100'}`}
                    >
                      {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1) || 'Pending'}
                    </span>
                  </p>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Payment Method:</span> {selectedOrder.paymentMethod || 'Card'}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Customer Information</h4>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Name:</span> {selectedOrder.shipping?.firstName} {selectedOrder.shipping?.lastName || 'N/A'}</p>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Email:</span> {selectedOrder.shipping?.email || 'N/A'}</p>
                  <p className="text-gray-300 mb-1"><span className="text-gray-500">Phone:</span> {selectedOrder.shipping?.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Shipping Address</h4>
                <p className="text-gray-300">
                  {selectedOrder.shipping?.address || 'N/A'}, {selectedOrder.shipping?.city || ''}, {selectedOrder.shipping?.state || ''} {selectedOrder.shipping?.zipCode || ''}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Order Items</h4>
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-750">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img 
                                  className="h-10 w-10 rounded object-cover"
                                  src={item.image} 
                                  alt={item.name} 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-white">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                <div>
                  <p className="text-gray-300 text-lg">Total: <span className="font-bold">${(selectedOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toFixed(2)}</span></p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      updateOrderStatus(selectedOrder._id, 'shipped');
                    }}
                    disabled={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                      selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'
                        ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FiTruck /> Mark as Shipped
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      updateOrderStatus(selectedOrder._id, 'delivered');
                    }}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${
                      selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'
                        ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <FiCheck /> Mark as Delivered
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Back button */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-300 hover:text-white flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement; 