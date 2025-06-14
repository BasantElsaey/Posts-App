import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Categories = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Travel', 'Tech', 'Lifestyle', 'Food'];
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        toast.error('Error fetching posts 😞', { autoClose: 7000 });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categoryPosts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = posts.filter((post) => post.category === category);
      return acc;
    }, {});
  }, [posts]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-base-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-base-content font-poppins">
        Explore Categories 🌈
      </h1>
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-base-content font-poppins">
            {category} 🎯
          </h2>
          {categoryPosts[category].length === 0 ? (
            <p className="text-center text-lg font-semibold text-base-content">
              No posts in {category}. Be the first to share! 🚀
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPosts[category].map((post) => (
                <div
                  key={post.id}
                  className="card bg-base-200 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
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
                      className="card-title text-xl font-semibold hover:text-primary font-poppins"
                    >
                      {post.title} 🌟
                    </Link>
                    <p className="text-base-content/80 text-sm line-clamp-2">{post.description}</p>
                    <p className="text-sm font-medium text-gray-600">
                      By User {post.userId} 👤
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Categories;