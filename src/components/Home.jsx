import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = ({ user }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Sample Post 1',
      imageUrl: 'https://via.placeholder.com/400x200',
      description: 'This is a sample blog post description.',
    },
    {
      id: 2,
      title: 'Sample Post 2',
      imageUrl: 'https://via.placeholder.com/400x200',
      description: 'Another sample blog post description.',
    },
  ]);

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast.success('Post deleted successfully');
  };

  return (
    <div className="container mx-auto p-6">
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
      <h2 className="text-3xl font-bold mb-6 text-center">Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-xl animate-fade-in">
            <figure>
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <p>{post.description}</p>
              <p className="text-sm text-base-content/70">By Zag</p>
              {user && (
                <div className="card-actions justify-end">
                  <Link to={`/edit-post/${post.id}`} className="btn btn-warning btn-sm">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="btn btn-error btn-sm">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;