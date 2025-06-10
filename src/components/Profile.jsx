import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get(`/users/${id}`);
        const postsResponse = await api.get(`/posts?userId=${id}`);
        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        toast.error('Error fetching profile 😞');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="card bg-base-100 shadow-2xl rounded-2xl p-8 glass animate-slide-up">
        <h1 className="text-4xl font-extrabold mb-6 text-gradient font-poppins">
          {user.username}'s Profile 🌟
        </h1>
        <p className="text-lg text-base-content/70 mb-4">
          Email: {user.email} 📧
        </p>
        <h2 className="text-2xl font-bold mb-4 text-gradient font-poppins">
          Posts by {user.username} 📝
        </h2>
        {posts.length === 0 ? (
          <p className="text-center text-lg text-base-content/70">
            No posts yet. Encourage {user.username} to share! 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
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
                  <p className="text-sm text-base-content/60">
                    Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;