import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ user, setUser, toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-tight">Zag's Blog</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm font-medium">Welcome, {user.username}</span>
              <Link to="/add-post" className="btn btn-success btn-sm rounded-full">+ New Post</Link>
              <button onClick={handleLogout} className="btn btn-error btn-sm rounded-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-ghost btn-sm">Signup</Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="btn btn-outline btn-sm rounded-full">
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;