import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        toast.error('Error fetching posts 😞');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading &&
        filteredPosts.length > paginatedPosts.length
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, filteredPosts.length, paginatedPosts.length]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully ✅');
    } catch (error) {
      toast.error('Error deleting post 😞');
      console.error(error);
    }
  };

  const handleLike = async (id) => {
    try {
      const post = posts.find((p) => p.id === id);
      await api.put(`/posts/${id}`, { ...post, likes: post.likes + 1 });
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
      toast.success('Post liked! ❤️');
    } catch (error) {
      toast.error('Error liking post 😞');
      console.error(error);
    }
  };

  const handleShare = (post) => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard! 📋');
  };

  const filteredPosts = posts.filter(
    (post) =>
      (category === 'all' || post.category === category) &&
      (author === 'all' || post.userId === parseInt(author)) &&
      (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedPosts = filteredPosts.slice(0, page * postsPerPage);

  const categories = ['all', 'Travel', 'Tech', 'Lifestyle'];
  const authors = ['all', ...new Set(posts.map((post) => post.userId))];

  if (loading && page === 1) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-gradient-to-r from-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="hero-content text-center z-10">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-6xl font-extrabold mb-4 font-poppins">
              Welcome to Zag's Blog 🌟
            </h1>
            <p className="text-xl mb-8">
              Share your stories, explore new ideas, and connect with the world! ✈️💻📝
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="input input-bordered w-full max-w-xs rounded-full bg-white text-black pl-10 focus:ring-2 focus:ring-secondary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="select select-bordered rounded-full bg-white text-black focus:ring-2 focus:ring-secondary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories 🌐' : `${cat} 🎯`}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered rounded-full bg-white text-black focus:ring-2 focus:ring-secondary"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                {authors.map((auth) => (
                  <option key={auth} value={auth}>
                    {auth === 'all' ? 'All Authors 👥' : `User ${auth} 👤`}
                  </option>
                ))}
              </select>
            </div>
            <Link
              to={user ? '/add-post' : '/signup'}
              className="btn btn-secondary btn-lg rounded-full mt-8 hover:scale-105 transition-transform duration-200"
            >
              {user ? 'Share Your Story 📝' : 'Join Now! 🌈'}
            </Link>
          </div>
        </div>
        {/* Wave SVG */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100">
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,0 L1440,0 L1440,100 C1200,50 900,100 720,80 C540,60 360,100 180,80 C90,70 0,50 0,0 Z"
          />
        </svg>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-8 text-center text-gradient font-poppins">
          Latest Stories 📚
        </h2>
        {paginatedPosts.length === 0 ? (
          <p className="text-center text-lg text-base-content/70">
            No posts found. Be the first to share! 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <div
                key={post.id}
                className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden glass hover:scale-105 transition-transform duration-300"
              >
                <figure>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                </figure>
                <div className="card-body p-6">
                  <Link
                    to={`/post/${post.id}`}
                    className="card-title text-2xl font-semibold hover:text-primary font-poppins"
                  >
                    {post.title} 🌟
                  </Link>
                  <p className="text-base-content/70 line-clamp-3">
                    {post.description}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    By User {post.userId} 👤
                  </p>
                  <p className="text-sm text-base-content/60">
                    Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="btn btn-ghost btn-sm hover:bg-primary/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {post.likes} ❤️
                    </button>
                    <button
                      onClick={() => handleShare(post)}
                      className="btn btn-ghost btn-sm hover:bg-primary/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                      </svg>
                      Share 📤
                    </button>
                  </div>
                  {user && post.userId === user.id && (
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="btn btn-warning btn-sm rounded-full hover:scale-105 transition-transform"
                      >
                        Edit ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn btn-error btn-sm rounded-full hover:scale-105 transition-transform"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="text-center mt-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="btn btn-primary btn-circle btn-lg fixed bottom-16 right-8 shadow-xl animate-pulse"
        title="Back to Top"
      >
        🚀
      </button>

      {/* Add Post Button */}
      {user && (
        <Link
          to="/add-post"
          className="btn btn-secondary btn-circle btn-lg fixed bottom-8 right-8 shadow-xl animate-bounce"
          title="Add New Post"
        >
          📝
        </Link>
      )}
    </div>
  );
};

export default Home;