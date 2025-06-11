import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';

const Home = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [page, setPage] = useState(1);
  const [serverError, setServerError] = useState(null);
  const postsPerPage = 6;

  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    const checkServer = async () => {
      try {
        await api.get('/posts');
      } catch (error) {
        setServerError('Unable to connect to the server. Please ensure JSON Server is running on http://localhost:3000.');
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          api.get('/posts'),
          api.get('/users'),
        ]);
        setPosts(postsResponse.data);
        setUsers(usersResponse.data);
        setServerError(null);
      } catch (error) {
        toast.error('Error fetching data 😞', { autoClose: 5000 });
        console.error('Fetch data error:', error);
        setServerError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        (category === 'all' || post.category === category) &&
        (author === 'all' || post.userId === author) &&
        (post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [posts, category, author, search]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading &&
        filteredPosts.length > page * postsPerPage
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, filteredPosts.length, page]);

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      toast.error('Only admins can delete posts! 🔐', { autoClose: 5000 });
      return;
    }
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully ✅', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error deleting post 😞', { autoClose: 5000 });
      console.error(error);
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault(); 
    if (!user) {
      toast.error('Please log in to like posts! 🔐', { autoClose: 5000 });
      return;
    }
    try {
      const post = posts.find((p) => p.id === id);
      const updatedPost = { ...post, likes: post.likes + 1 };
      await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
      toast.success('Post liked! ❤️', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error liking post 😞', { autoClose: 5000 });
      console.error('Like error:', error);
    }
  };

  const handleShare = (platform, post) => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(post.title);
    let url;

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    window.open(url, '_blank');
    toast.success(`Shared to ${platform}! 📤`, { autoClose: 5000 });
  };

  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  const paginatedPosts = filteredPosts.slice(0, page * postsPerPage);

  const categories = ['all', 'Travel', 'Tech', 'Lifestyle', 'Food'];
  const authors = ['all', ...new Set(posts.map((post) => post.userId))];

  const suggestions = useMemo(() => {
    const terms = posts.flatMap((post) => [
      ...post.title.toLowerCase().split(' '),
      ...post.description.toLowerCase().split(' '),
    ]);
    return [...new Set(terms.filter((term) => term.length > 2))].slice(0, 5);
  }, [posts]);

  if (serverError) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Server Error 😞</h2>
        <p>{serverError}</p>
        <p>Please ensure JSON Server is running (`npx json-server --watch db.json --port 3000`).</p>
      </div>
    );
  }

  if (loading && page === 1) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <div className="hero min-h-[85vh] bg-gradient-to-r from-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="hero-content text-center z-10">
          <div className="max-w-2xl animate-slide-up">
            {user && (
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Welcome, {user.username}! 👋</h2>
              </div>
            )}
            <h1 className="text-6xl font-extrabold mb-4 font-poppins">
              Welcome to Zag's Blog 🌟
            </h1>
            <p className="text-xl mb-8">
              Share your stories, explore new ideas, and connect with the world! ✈️💻📝
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts...🔎"
                  className="input input-bordered w-50 max-w-xs rounded-full bg-white text-black pl-10 focus:ring-2 focus:ring-secondary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  list="search-suggestions"
                />
                <datalist id="search-suggestions">
                  {suggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-md rounded-full ${
                      category === cat ? 'btn-primary' : 'btn-ghost bg-white text-black'
                    } hover:bg-primary hover:text-white transition-all duration-200`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat === 'all' ? 'All Categories 🌐' : `${cat} 🎯`}
                  </button>
                ))}
              </div>
              <select
                className="select select-bordered rounded-full bg-white text-black focus:ring-2 focus:ring-secondary"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                {authors.map((auth) => (
                  <option key={auth} value={auth}>
                    {auth === 'all' ? 'All Authors 👥' : getUsername(auth)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100">
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,0 L1440,0 L1440,100 C1200,50 900,100 720,80 C540,60 360,100 180,80 C90,70 0,50 0,0 Z"
          />
        </svg>
      </div>
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
                    src={post.imageUrl || defaultImage}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => (e.target.src = defaultImage)}
                  />
                </figure>
                <div className="card-body p-6">
                  <Link
                    to={`/post/${post.id}`}
                    className="card-title text-2xl font-semibold hover:text-primary font-poppins"
                  >
                    {post.title} 🌟
                  </Link>
                  <p className="text-base-content/70 line-clamp-3">{post.description}</p>
                  <p className="text-sm font-medium text-primary">By {getUsername(post.userId)} 👤</p>
                  <p className="text-sm text-base-content/60">
                    Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={(e) => handleLike(e, post.id)}
                      className="btn btn-ghost btn-sm hover:bg-primary/10"
                      title={user ? 'Like this post' : 'Log in to like posts'}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {post.likes} ❤️
                    </button>
                    <button
                      onClick={() => handleShare('twitter', post)}
                      className="btn btn-ghost btn-sm hover:bg-primary/10 social-btn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook', post)}
                      className="btn btn-ghost btn-sm hover:bg-primary/10 social-btn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-7h-2v-2h2v-1.5c0-2.07 1.24-3.2 3.07-3.2.88 0 1.64.07 1.86.1v2.1h-1.27c-1 0-1.2.48-1.2 1.18V12h2.4l-.31 2h-2.09v7c4.56-.93 8-4.96 8-9.8z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                  <Link
                    to={`/post/${post.id}`}
                    className="btn btn-primary btn-sm mt-4 rounded-full"
                  >
                    Read More 📖
                  </Link>
                  {isAdmin() && (
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
      {user && (
        <Link
          to="/add-post"
          className="btn btn-primary btn-circle btn-lg fixed bottom-8 right-8 shadow-xl hover:scale-110 transition-transform duration-300 animate-pulse"
          title="Add New Post"
        >
          +
        </Link>
      )}
    </div>
  );
};

export default Home;