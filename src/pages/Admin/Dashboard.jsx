import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiBarChart2, FiBook, FiDollarSign, FiHome, FiMail, FiPieChart, FiShoppingBag, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:4002';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalBooks: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingBooks, setTopSellingBooks] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || !isAdmin()) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [currentUser, isAdmin, navigate]);

  // Fetch real data from MongoDB
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get statistics
      const [booksRes, ordersRes, usersRes, emailsRes] = await Promise.all([
        axios.get(`${API_URL}/book`),
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/user`),
        axios.get(`${API_URL}/emails`)
      ]);

      const books = booksRes.data || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const emails = emailsRes.data || [];
      
      // Calculate total revenue
      const revenue = orders.reduce((total, order) => {
        const orderTotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        return total + orderTotal;
      }, 0);

      // Set overall statistics
      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalCustomers: users.length,
        totalBooks: books.length
      });

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sortedOrders.slice(0, 5));

      // Get top selling books
      const bookSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (bookSales[item._id]) {
            bookSales[item._id].quantity += item.quantity;
          } else {
            bookSales[item._id] = {
              _id: item._id,
              name: item.name,
              quantity: item.quantity,
              image: item.image
            };
          }
        });
      });

      const topBooks = Object.values(bookSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setTopSellingBooks(topBooks);

      // Process sales data by month
      const salesByMonth = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      orders.forEach(order => {
        const date = new Date(order.createdAt);
        const month = months[date.getMonth()];
        const total = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
        
        if (salesByMonth[month]) {
          salesByMonth[month] += total;
        } else {
          salesByMonth[month] = total;
        }
      });

      // Convert to array for chart
      const chartData = months.map(month => ({
        name: month,
        sales: salesByMonth[month] || 0
      }));
      setSalesData(chartData);

      // Process category data
      const categoryCounts = {};
      books.forEach(book => {
        const category = book.category || 'Other';
        if (categoryCounts[category]) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      });

      // Convert to array for pie chart
      const categoryChartData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
      }));
      setCategoryData(categoryChartData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      
      // Fallback to mock data for development/demo
      setMockData();
    }
  };

  // Fallback to mock data if API fails
  const setMockData = () => {
    // Set mock stats
    setStats({
      totalRevenue: 12459.99,
      totalOrders: 156,
      totalCustomers: 98,
      totalBooks: 42
    });

    // Set mock recent orders
    setRecentOrders([
      {
        _id: 'ORD123456',
        user: { name: 'John Smith', email: 'john@example.com' },
        items: [{ name: 'Atomic Habits', price: 14.99, quantity: 1 }],
        status: 'delivered',
        createdAt: new Date(2023, 2, 28).toISOString()
      },
      {
        _id: 'ORD123457',
        user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
        items: [{ name: 'The Subtle Art of Not Giving a F*ck', price: 12.99, quantity: 1 }],
        status: 'shipped',
        createdAt: new Date(2023, 2, 27).toISOString()
      },
      {
        _id: 'ORD123458',
        user: { name: 'Michael Chen', email: 'michael@example.com' },
        items: [{ name: 'Sapiens', price: 16.99, quantity: 1 }],
        status: 'processing',
        createdAt: new Date(2023, 2, 26).toISOString()
      }
    ]);

    // Set mock top selling books
    setTopSellingBooks([
      { _id: '1', name: 'Atomic Habits', quantity: 42, image: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg' },
      { _id: '2', name: 'The Psychology of Money', quantity: 35, image: 'https://m.media-amazon.com/images/I/71TRB+IecpL._AC_UF1000,1000_QL80_.jpg' },
      { _id: '3', name: 'Sapiens', quantity: 28, image: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg' }
    ]);

    // Set mock sales data
    setSalesData([
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 5000 },
      { name: 'Mar', sales: 6000 },
      { name: 'Apr', sales: 7000 },
      { name: 'May', sales: 5500 },
      { name: 'Jun', sales: 4500 }
    ]);

    // Set mock category data
    setCategoryData([
      { name: 'Fiction', value: 15 },
      { name: 'Non-Fiction', value: 12 },
      { name: 'Self-Help', value: 8 },
      { name: 'Business', value: 7 }
    ]);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-600 text-green-100';
      case 'shipped':
        return 'bg-blue-600 text-blue-100';
      case 'processing':
        return 'bg-yellow-600 text-yellow-100';
      case 'cancelled':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-purple-600 text-purple-100';
    }
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

  // Stat Card Component
  const StatCard = ({ icon, title, value, trend, color }) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'overview'
                          ? 'bg-secondary text-white'
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <FiHome className="mr-3" /> Overview
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'books'
                          ? 'bg-secondary text-white'
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => navigate('/admin/books')}
                    >
                      <FiBook className="mr-3" /> Manage Books
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'orders'
                          ? 'bg-secondary text-white'
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => navigate('/admin/orders')}
                    >
                      <FiShoppingBag className="mr-3" /> Orders
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'subscribers'
                          ? 'bg-secondary text-white'
                          : 'text-gray-300 hover:bg-slate-700'
                      }`}
                      onClick={() => navigate('/admin/emails')}
                    >
                      <FiMail className="mr-3" /> Subscribers
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<FiUsers className="text-blue-500 text-xl" />}
                title="Total Customers"
                value={stats.totalCustomers}
                trend={+12}
                color="bg-blue-500/10"
              />
              <StatCard
                icon={<FiShoppingBag className="text-purple-500 text-xl" />}
                title="Total Orders"
                value={stats.totalOrders}
                trend={+8}
                color="bg-purple-500/10"
              />
              <StatCard
                icon={<FiDollarSign className="text-green-500 text-xl" />}
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                trend={+15}
                color="bg-green-500/10"
              />
              <StatCard
                icon={<FiBook className="text-orange-500 text-xl" />}
                title="Total Books"
                value={stats.totalBooks}
                trend={+5}
                color="bg-orange-500/10"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Chart */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiBarChart2 className="mr-2 text-secondary" /> Sales Statistics
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
                        formatter={(value) => [`$${value}`, 'Sales']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#6366F1" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiPieChart className="mr-2 text-secondary" /> Book Categories
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-secondary" /> Recent Activity
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-400 text-sm border-b border-slate-700">
                    <tr>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Action</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-slate-700">
                        <td className="py-3 text-white">
                          {order.shipping?.firstName 
                            ? `${order.shipping.firstName} ${order.shipping.lastName || ''}`
                            : 'Unknown Customer'}
                        </td>
                        <td className="py-3 text-white">{order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}</td>
                        <td className="py-3 text-gray-300">{formatDate(order.createdAt)}</td>
                        <td className="py-3 text-gray-300">{formatCurrency(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 