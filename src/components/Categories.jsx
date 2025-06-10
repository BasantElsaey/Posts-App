import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Categories = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Travel', 'Tech', 'Lifestyle'];

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

  if (loading) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gradient font-poppins">
        Explore Categories 🌈
      </h1>
      {categories.map((category) => {
        const categoryPosts = posts.filter((post) => post.category === category);
        return (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient font-poppins">
              {category} 🎯
            </h2>
            {categoryPosts.length === 0 ? (
              <p className="text-center text-lg text-base-content/70">
                No posts in {category} yet. Be the first to share! 🚀
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPosts.map((post) => (
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Categories;