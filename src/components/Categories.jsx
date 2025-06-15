import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Categories = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { name: 'Travel', icon: '✈️', color: 'from-blue-400 to-cyan-400', bg: 'from-blue-50 to-cyan-50' },
    { name: 'Tech', icon: '💻', color: 'from-purple-400 to-indigo-400', bg: 'from-purple-50 to-indigo-50' },
    { name: 'Lifestyle', icon: '🌿', color: 'from-green-400 to-emerald-400', bg: 'from-green-50 to-emerald-50' },
    { name: 'Food', icon: '🍕', color: 'from-orange-400 to-red-400', bg: 'from-orange-50 to-red-50' }
  ];
  
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsResponse = await api.get('/posts');
        setPosts(postsResponse.data);

        const userIds = [...new Set(postsResponse.data.map(post => post.userId))];
        if (userIds.length > 0) {
          const usersResponse = await api.get('/users');
          setUsers(usersResponse.data || []);
        }
      } catch (error) {
        toast.error('Error fetching posts or users 😞', { autoClose: 7000 });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndUsers();
  }, []);

  const categoryPosts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = posts.filter((post) => post.category === category.name);
      return acc;
    }, {});
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(post => post.category === activeCategory);
  }, [posts, activeCategory]);

  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found in users list`);
      return `Unknown User (${userId})`;
    }
    return user.username;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150 mx-auto mt-2 ml-2"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700 mt-6 animate-pulse">Discovering amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Explore Categories
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Discover amazing content across different topics 🌈
            </p>
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3">
                <span className="text-lg font-semibold">{posts.length} Amazing Posts Waiting</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
      </div>

      {/* Category Filter Tabs */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">🌟</span>
              All Categories ({posts.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name} ({categoryPosts[category.name].length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        {activeCategory === 'all' ? (
          // Show all categories grouped
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.name} className="group">
                <div className="flex items-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-2xl mr-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {categoryPosts[category.name].length} posts in this category
                    </p>
                  </div>
                </div>

                {categoryPosts[category.name].length === 0 ? (
                  <div className={`bg-gradient-to-r ${category.bg} rounded-3xl p-12 text-center border-2 border-dashed border-gray-300`}>
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts in {category.name} yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to share amazing {category.name.toLowerCase()} content!</p>
                    <Link 
                      to="/create-post" 
                      className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${category.color} text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                    >
                      <span className="mr-2">✨</span>
                      Create First Post
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryPosts[category.name].map((post, index) => (
                      <div
                        key={post.id}
                        className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={post.imageUrl || defaultImage}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => (e.target.src = defaultImage)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${category.color} text-white text-sm font-semibold rounded-full`}>
                            {category.icon} {category.name}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <Link
                            to={`/post/${post.id}`}
                            className="block group-hover:text-purple-600 transition-colors duration-300"
                          >
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600">
                              {post.title}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {post.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${getUsername(post.userId) || 'Unknown'}`} // استخدام getUsername
                                alt="Author avatar"
                                className="w-8 h-8 rounded-full mr-2 border-2 border-purple-200"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {getUsername(post.userId) || 'Unknown'} {/* استخدام username */}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {moment(post.createdAt).format('MMM D')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Show filtered category
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${categories.find(c => c.name === activeCategory)?.color} text-white rounded-full shadow-lg mb-4`}>
                <span className="text-3xl mr-3">{categories.find(c => c.name === activeCategory)?.icon}</span>
                <span className="text-2xl font-bold">{activeCategory}</span>
              </div>
              <p className="text-gray-600 text-lg">
                {filteredPosts.length} amazing posts to explore
              </p>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">{categories.find(c => c.name === activeCategory)?.icon}</div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">No posts yet in {activeCategory}</h3>
                <p className="text-gray-600 text-lg mb-8">Be the first to share amazing content!</p>
                <Link 
                  to="/create-post" 
                  className={`inline-flex items-center px-10 py-4 bg-gradient-to-r ${categories.find(c => c.name === activeCategory)?.color} text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg`}
                >
                  <span className="mr-3">✨</span>
                  Create First Post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={post.imageUrl || defaultImage}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = defaultImage)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${categories.find(c => c.name === activeCategory)?.color} text-white text-sm font-semibold rounded-full`}>
                        {categories.find(c => c.name === activeCategory)?.icon} {activeCategory}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <Link
                        to={`/post/${post.id}`}
                        className="block group-hover:text-purple-600 transition-colors duration-300"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${getUsername(post.userId) || 'Unknown'}`} // استخدام getUsername
                            alt="Author avatar"
                            className="w-8 h-8 rounded-full mr-2 border-2 border-purple-200"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {getUsername(post.userId) || 'Unknown'} {/* استخدام username */}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {moment(post.createdAt).format('MMM D')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;