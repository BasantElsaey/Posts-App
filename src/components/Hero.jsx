import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Hero = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero min-h-[50vh] bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl p-10 mb-8 animate-slide-up">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold font-poppins">Welcome to Zag's Blog 🌟</h1>
          <p className="py-6 text-lg">Discover amazing stories and insights from our community! ✈️💻📝</p>
          {user && (
            <Link to="/add-post" className="btn btn-primary btn-lg rounded-full hover:scale-105 transition-transform">
              Create a New Post 🚀
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;