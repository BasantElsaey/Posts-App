import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ user }) => {
  return (
    <div className="hero bg-base-200 rounded-lg p-10 mb-8 animate-fade-in">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">Welcome to Our Blog</h1>
          <p className="py-6">Discover amazing stories and insights from Zag and our community.</p>
          {user && (
            <Link to="/add-post" className="btn btn-primary">Create a New Post</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;