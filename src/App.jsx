import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Courses from "./components/Course";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthContext";
import About from './pages/About';
import AddBook from "./pages/Admin/AddBook";
import Dashboard from "./pages/Admin/Dashboard";
import EmailList from "./pages/Admin/EmailList";
import ManageBooks from "./pages/Admin/ManageBooks";
import OrdersManagement from "./pages/Admin/OrdersManagement";
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import Wishlist from './pages/Wishlist';
import PaymentSuccess from "./PaymentSuccess";

export default function App() {
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    // Add Poppins font to the entire application
    const addPoppinsFont = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
      
      // Add a style element for Poppins font family
      const style = document.createElement('style');
      style.textContent = `
        * {
          font-family: 'Poppins', sans-serif;
        }
      `;
      document.head.appendChild(style);
    };
    
    addPoppinsFont();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Courses/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/paymentsuccess" element={<PaymentSuccess/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={currentUser ? <Checkout /> : <Navigate to="/signup" />} />
          <Route path="/order-success" element={currentUser ? <OrderSuccess /> : <Navigate to="/" />} />
          <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/signup" />} />
          {/* Auth Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={currentUser && (currentUser.role === 'admin' || isAdmin()) ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/admin/books" element={currentUser && (currentUser.role === 'admin' || isAdmin()) ? <ManageBooks /> : <Navigate to="/" />} />
          <Route path="/admin/add-book" element={currentUser && (currentUser.role === 'admin' || isAdmin()) ? <AddBook /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={currentUser && (currentUser.role === 'admin' || isAdmin()) ? <OrdersManagement /> : <Navigate to="/" />} />
          <Route path="/admin/emails" element={currentUser && (currentUser.role === 'admin' || isAdmin()) ? <EmailList /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}