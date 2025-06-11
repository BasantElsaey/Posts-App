import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AddEditPost from './components/AddEditPost';
import PostDetails from './components/PostDetails';
import Profile from './components/Profile';
import Categories from './components/Categories';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(AuthContext);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
            <Route path="/add-post" element={<ProtectedRoute><AddEditPost /></ProtectedRoute>} />
            <Route path="/edit-post/:id" element={<ProtectedRoute><AddEditPost /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;