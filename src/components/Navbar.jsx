import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ user, setUser, toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Blog System</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.email}</span>
              <Link to="/add-post" className="btn btn-success btn-sm">+ Add Post</Link>
              <button onClick={handleLogout} className="btn btn-error btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-ghost btn-sm">Signup</Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="btn btn-outline btn-sm">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;