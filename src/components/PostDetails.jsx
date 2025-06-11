import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to like posts! 🔐', { autoClose: 5000 });
      navigate('/login');
      return;
    }
    try {
      const updatedPost = { ...post, likes: post.likes + 1 };
      await api.put(`/posts/${id}`, updatedPost);
      setPost(updatedPost);
      toast.success('Post liked! ❤️', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error liking post 😞', { autoClose: 5000 });
      console.error('Like error:', error);
    }
  };

  const handleShare = (platform) => {
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

  const handleDelete = async () => {
    if (!user || post.userId !== user.id) {
      toast.error('You can only delete your own posts! 🔐', { autoClose: 5000 });
      return;
    }
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted successfully ✅', { autoClose: 5000 });
      navigate('/');
    } catch (error) {
      toast.error('Error deleting post 😞', { autoClose: 5000 });
      console.error('Delete error:', error);
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
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleLike}
              className="btn btn-ghost btn-sm hover:bg-primary/10"
              title={user ? 'Like this post' : 'Log in to like posts'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {post.likes} ❤️
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="btn btn-ghost btn-sm hover:bg-primary/10 social-btn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="btn btn-ghost btn-sm hover:bg-primary/10 social-btn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-7h-2v-2h2v-1.5c0-2.07 1.24-3.2 3.07-3.2.88 0 1.64.07 1.86.1v2.1h-1.27c-1 0-1.2.48-1.2 1.18V12h2.4l-.31 2h-2.09v7c4.56-.93 8-4.96 8-9.8z" />
              </svg>
              Facebook
            </button>
          </div>
          <div className="mt-4">
            <span className="badge badge-primary badge-lg">{post.category}</span>
          </div>
          {user && post.userId === user.id && (
            <div className="mt-4 flex gap-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="btn btn-warning btn-sm rounded-full hover:scale-105 transition-transform"
              >
                Edit ✏️
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-sm rounded-full hover:scale-105 transition-transform"
              >
                Delete 🗑️
              </button>
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 text-gradient font-poppins">Comments 💬</h3>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 border-l-4 border-primary pl-4">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img
                          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${getUsername(comment.userId)}`}
                          alt="Commenter avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">
                        {getUsername(comment.userId)} | {moment(comment.createdAt).format('MMM D, YYYY')}
                      </p>
                      <p className="text-base-content">{comment.text}</p>
                    </div>
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
                  placeholder="Write your comment... 💬"
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