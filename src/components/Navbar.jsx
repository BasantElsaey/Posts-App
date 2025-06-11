import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/" className="font-poppins">Home 🏠</Link>
            </li>
            <li>
              <Link to="/categories" className="font-poppins">Categories 🌈</Link>
            </li>
            {user && (
              <li>
                <Link to="/profile" className="font-poppins">Profile 👤</Link>
              </li>
            )}
            {!user && (
              <>
                <li>
                  <Link to="/login" className="font-poppins">Login 🔐</Link>
                </li>
                <li>
                  <Link to="/signup" className="font-poppins">Signup 🌟</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-poppins text-gradient">
          Zag's Blog 🌟
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="font-poppins text-lg hover:text-primary">Home 🏠</Link>
          </li>
          <li>
            <Link to="/categories" className="font-poppins text-lg hover:text-primary">Categories 🌈</Link>
          </li>
          {user && (
            <li>
              <Link to="/profile" className="font-poppins text-lg hover:text-primary">Profile 👤</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <span className="mr-4 font-poppins text-base-content/80">
              Welcome, {user.username} 👋
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-md rounded-full hover:scale-105 transition-transform"
            >
              Logout 🚪
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-primary btn-md rounded-full mr-2 hover:scale-105 transition-transform"
            >
              Login 🔐
            </Link>
            <Link
              to="/signup"
              className="btn btn-secondary btn-md rounded-full hover:scale-105 transition-transform"
            >
              Signup 🌟
            </Link>
          </>
        )}
        <label className="swap swap-rotate ml-4">
          <input
            type="checkbox"
            className="theme-controller"
            value="dark"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <svg
            className="swap-on fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.6-2A1,1,0,0,0,8.83,2.17,10,10,0,1,0,21.83,12.17,1,1,0,0,0,21.64,13Z" />
          </svg>
          <svg
            className="swap-off fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12,17A5,5,0,1,1,17,12,5,5,0,0,1,12,17Zm0,2A7,7,0,1,0,5,12,7,7,0,0,0,12,19Zm0,3A10,10,0,1,1,22,12,10,10,0,0,1,12,22Z" />
          </svg>
        </label>
      </div>
    </div>
  );
};

export default Navbar;