import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [users, setUsers] = useState([]);
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, usersResponse] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get('/users'),
        ]);
        setPost(postResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        toast.error('Error fetching post 😞', { autoClose: 5000 });
        console.error('Fetch post error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to comment! 🔐', { autoClose: 5000 });
      return;
    }
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty 😞', { autoClose: 5000 });
      return;
    }
    try {
      const newComment = {
        id: Date.now().toString(),
        userId: user.id,
        text: commentText,
        createdAt: new Date().toISOString(),
      };
      const updatedPost = {
        ...post,
        comments: [...(post.comments || []), newComment],
      };
      await api.put(`/posts/${id}`, updatedPost);
      setPost(updatedPost);
      setCommentText('');
      toast.success('Comment added successfully! 💬', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error adding comment 😞', { autoClose: 5000 });
      console.error('Comment error:', error);
    }
  };

  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-error">Post not found 😞</h2>
        <Link to="/" className="btn btn-primary mt-4 rounded-full">
          Back to Home 🏠
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-base-100">
      <div className="card bg-base-100 shadow-2xl rounded-2xl p-8 glass max-w-4xl mx-auto animate-slide-up">
        <figure>
          <img
            src={post.imageUrl || defaultImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-t-2xl"
            onError={(e) => (e.target.src = defaultImage)}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl font-extrabold text-gradient font-poppins">
            {post.title} 🌟
          </h2>
          <p className="text-sm text-base-content/60">
            By {getUsername(post.userId)} 👤 | Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
          </p>
          <p className="text-lg text-base-content/80 mt-4">{post.description}</p>
          <div className="mt-4">
            <span className="badge badge-primary badge-lg">{post.category}</span>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 text-gradient font-poppins">Comments 💬</h3>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-primary pl-4">
                    <p className="text-sm text-base-content/60">
                      {getUsername(comment.userId)} | {moment(comment.createdAt).format('MMM D, YYYY')}
                    </p>
                    <p className="text-base-content">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/70">No comments yet. Be the first to comment! 💬</p>
            )}
          </div>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Add a Comment ✍️</span>
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-2xl focus:ring-2 focus:ring-primary"
                  placeholder="Write your comment..."
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary rounded-full hover:scale-105 transition-transform"
              >
                Post Comment 🚀
              </button>
            </form>
          )}
          <Link
            to="/"
            className="btn btn-secondary btn-sm mt-6 rounded-full hover:scale-105 transition-transform"
          >
            Back to Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;