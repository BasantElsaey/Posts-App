import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        toast.error('Error fetching posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      (category === 'all' || post.category === category) &&
      (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ['all', 'Travel', 'Tech', 'Lifestyle'];

  if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="container mx-auto p-6">
      <div className="hero bg-base-200 rounded-xl p-12 mb-8 animate-fade-in">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome to Zag's Blog</h1>
            <p className="text-lg mb-6">Explore inspiring stories, share your own, and connect with our community.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="form-control flex-1">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="input input-bordered w-full rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered rounded-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-2xl rounded-xl overflow-hidden animate-slide-up">
            <figure>
              <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-semibold">{post.title}</h2>
              <p className="text-base-content/70 line-clamp-3">{post.description}</p>
              <p className="text-sm font-medium text-primary">By Zag</p>
              {user && (
                <div className="card-actions justify-end mt-4">
                  <Link to={`/edit-post/${post.id}`} className="btn btn-warning btn-sm rounded-full">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="btn btn-error btn-sm rounded-full">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {user && (
        <Link
          to="/add-post"
          className="btn btn-primary btn-circle btn-lg fixed bottom-8 right-8 shadow-xl animate-pulse"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default Home;