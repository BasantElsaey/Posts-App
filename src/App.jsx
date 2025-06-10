import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AddEditPost from './components/AddEditPost';
import PostDetails from './components/PostDetails';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
          <Route path="/add-post" element={<ProtectedRoute><AddEditPost /></ProtectedRoute>} />
          <Route path="/edit-post/:id" element={<ProtectedRoute><AddEditPost /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;