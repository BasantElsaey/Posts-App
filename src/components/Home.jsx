import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [page, setPage] = useState(1);
  const [serverError, setServerError] = useState(null);
  const postsPerPage = 3;
  const postsSectionRef = useRef(null);

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
        console.log('Users data:', usersResponse.data); // للتحقق
        if (!usersResponse.data || usersResponse.data.length === 0) {
          console.warn('No users data received from API');
          setUsers([]);
        } else {
          setUsers(usersResponse.data);
        }
        setPosts(postsResponse.data || []);
        setServerError(null);
      } catch (error) {
        toast.error('Error fetching data 😞', { autoClose: 10000 });
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
        (author === 'all' || getUsername(post.userId) === author) &&
        (post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [posts, category, author, search]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, page]);

  const handleDelete = async (id) => {
    try {
      const post = posts.find((p) => p.id === id);
      if (!user || post.userId !== user.id) {
        toast.error('You can only delete your own posts! 🔐', { autoClose: 10000 });
        return;
      }
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully ✅', { autoClose: 10000 });
      if (paginatedPosts.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      toast.error('Error deleting post 😞', { autoClose: 10000 });
      console.error(error);
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to like posts! 🔐', { autoClose: 10000 });
      navigate('/login');
      return;
    }
    try {
      const post = posts.find((p) => p.id === id);
      const updatedPost = { ...post, likes: post.likes + 1 };
      await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
      toast.success('Post liked! ❤️', { autoClose: 10000 });
    } catch (error) {
      toast.error('Error liking post 😞', { autoClose: 10000 });
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
    toast.success(`Shared to ${platform}! 📤`, { autoClose: 10000 });
  };

  const getUsername = (userId) => {
    if (!users.length) return `Unknown User (${userId})`;
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found in users list`);
      return `Unknown User (${userId})`;
    }
    return user.username;
  };

  const authors = useMemo(() => {
    const validUsers = users.filter((u) => posts.some((p) => p.userId === u.id));
    return ['all', ...validUsers.map((u) => u.username)];
  }, [posts, users]);

  const categories = ['all', 'Travel', 'Tech', 'Lifestyle', 'Food'];

  const suggestions = useMemo(() => {
    const terms = posts.flatMap((post) => [
      ...post.title.toLowerCase().split(' '),
      ...post.description.toLowerCase().split(' '),
    ]);
    return [...new Set(terms.filter((term) => term.length > 2))].slice(0, 5);
  }, [posts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (postsSectionRef.current) {
        postsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (serverError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center p-8 bg-base-100 rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-error mb-3">Server Error</h2>
          <p className="text-base-content/70 mb-4">{serverError}</p>
          <p className="text-sm text-base-content/50">Please ensure JSON Server is running (`npx json-server --watch db.json --port 3000`).</p>
        </div>
      </div>
    );
  }

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-lg text-primary font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="relative bg-gradient-to-r from-primary via-secondary to-accent text-primary-content overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-current/20"></div>
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-current/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-current/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-current/20 rounded-full blur-md animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            {user && (
              <div className="mb-4">
                <span className="inline-block bg-base-100/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-base-content">
                  Welcome back, {user.username}! 👋
                </span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-content drop-shadow-lg">
              Zag's Creative Hub 🌟
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-content/90 max-w-2xl mx-auto">
              Discover stories, share ideas, and connect with amazing minds around the world
            </p>

            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-5xl mx-auto">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-12 pr-4 py-3 bg-base-100/20 backdrop-blur-sm border border-base-content/30 rounded-2xl text-base-content placeholder-base-content/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    jsx={cat === category ? 'true' : 'false'}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      category === cat 
                        ? 'bg-base-100 text-base-content shadow-lg' 
                        : 'bg-base-100/20 backdrop-blur-sm text-primary-content hover:bg-base-100/30'
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat === 'all' ? '🌐 All' : `${cat}`}
                  </button>
                ))}
              </div>

              <select
                className="px-4 py-3 bg-base-100/20 backdrop-blur-sm border border-base-content/30 rounded-2xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary min-w-40"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                {authors.map((auth) => (
                  <option key={auth} value={auth} className="text-base-content bg-base-100">
                    {auth === 'all' ? '👥 All Authors' : auth}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-16">
            <path
              fill="hsl(var(--b2))"
              d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>

      <div ref={postsSectionRef} className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Latest Stories 📚
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        {paginatedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-base-content mb-2">No posts found</h3>
            <p className="text-base-content/70 mb-6">Be the first to share your amazing story!</p>
            {user && (
              <Link to="/add-post" className="btn btn-primary hover:scale-105 transition-transform">
                Create First Post 🚀
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post, index) => (
              <div
                key={post.id}
                className="group bg-base-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.imageUrl || defaultImage}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.target.src = defaultImage)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-base-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-base-content">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-content text-sm font-bold">
                      {getUsername(post.userId).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content">{getUsername(post.userId)}</p>
                      <p className="text-xs text-base-content/60">{moment(post.createdAt).format('MMM D, YYYY')}</p>
                    </div>
                  </div>

                  <Link to={`/post/${post.id}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-base-content hover:text-primary transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-base-content/70 text-sm line-clamp-3">{post.description}</p>
                  </Link>

                  <div className="flex items-center justify-between pt-4 border-t border-base-300">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLike(e, post.id)}
                        className="flex items-center gap-2 text-sm text-base-content/70 hover:text-error transition-colors group/like"
                        title={user ? 'Like this post' : 'Log in to like posts'}
                      >
                        <svg className="w-5 h-5 group-hover/like:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleShare('twitter', post)}
                          className="p-2 text-base-content/40 hover:text-info hover:bg-info/10 rounded-full transition-all"
                          title="Share on Twitter"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShare('facebook', post)}
                          className="p-2 text-base-content/40 hover:text-info hover:bg-info/10 rounded-full transition-all"
                          title="Share on Facebook"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <Link
                      to={`/post/${post.id}`}
                      className="text-sm font-medium text-primary hover:text-primary-focus transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>

                  {user && post.userId === user.id && (
                    <div className="flex gap-2 pt-4 border-t border-base-300 mt-4">
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="flex-1 bg-warning/20 hover:bg-warning/30 text-warning-content text-center py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 bg-error/20 hover:bg-error/30 text-error-content py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                page === 1 
                  ? 'bg-base-300 text-base-content/40 cursor-not-allowed' 
                  : 'bg-base-100 text-base-content hover:bg-primary/10 hover:text-primary shadow-md hover:shadow-lg'
              }`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              ← Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i + 1}
                  jsx={page === i + 1 ? 'true' : 'false'}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    page === i + 1
                      ? 'bg-primary text-primary-content shadow-lg'
                      : 'bg-base-100 text-base-content hover:bg-primary/10 shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                page === totalPages 
                  ? 'bg-base-300 text-base-content/40 cursor-not-allowed' 
                  : 'bg-base-100 text-base-content hover:bg-primary/10 hover:text-primary shadow-md hover:shadow-lg'
              }`}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {user && (
        <Link
          to="/add-post"
          className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-content rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl z-50 group"
          title="Add New Post"
        >
          <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
        </Link>
      )}
    </div>
  );
};

export default Home;