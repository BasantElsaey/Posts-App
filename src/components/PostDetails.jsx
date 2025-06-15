import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';
// import { Picker } from 'emoji-mart'; // معلق مؤقتاً

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
          <div className="text-center bg-white/70 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">Please try again later.</p>
            <Link to="/" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <span className="mr-2">🏠</span>
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PostDetails = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [users, setUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liked, setLiked] = useState(false);
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [postResponse, usersResponse] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get('/users'),
        ]);
        setPost(postResponse.data);
        setUsers(usersResponse.data);
        const hasLiked = postResponse.data.likesHistory?.includes(user.id) || false;
        setLiked(hasLiked);
      } catch (error) {
        toast.error('Error fetching post 😞', { autoClose: 5000 });
        console.error('Fetch post error:', error);
      }
    };
    fetchData();
  }, [id, user, loading, navigate]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // التأكد من إن الـ form مش بيريفريش
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
        username: user.username,
        text: commentText,
        createdAt: new Date().toISOString(),
      };
      const updatedPost = {
        ...post,
        comments: [...(post.comments || []), newComment],
      };
      await api.put(`/posts/${id}`, updatedPost); // تحديث الـ API
      setPost(updatedPost); // تحديث الـ state
      setCommentText(''); // مسح الحقل
      setShowEmojiPicker(false);
      toast.success('Comment added successfully! 💬', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error adding comment 😞', { autoClose: 5000 });
      console.error('Comment error:', error);
    }
  };

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to like posts! 🔐', { autoClose: 5000 });
      navigate('/login');
      return;
    }
    try {
      const isLiked = !liked;
      const updatedLikes = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
      const updatedLikesHistory = isLiked
        ? [...(post.likesHistory || []), user.id]
        : (post.likesHistory || []).filter(uid => uid !== user.id);
      const updatedPost = { ...post, likes: updatedLikes, likesHistory: updatedLikesHistory };
      await api.put(`/posts/${id}`, updatedPost);
      setPost(updatedPost);
      setLiked(isLiked);
      toast.success(isLiked ? 'Post liked! ❤️' : 'Like removed! 😞', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error updating like 😞', { autoClose: 5000 });
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

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.error('Please log in to delete comments! 🔐', { autoClose: 5000 });
      return;
    }
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment || comment.username !== user.username) {
      toast.error('You can only delete your own comments! 🔐', { autoClose: 5000 });
      return;
    }
    try {
      const updatedComments = post.comments.filter(c => c.id !== commentId);
      const updatedPost = { ...post, comments: updatedComments };
      await api.put(`/posts/${id}`, updatedPost);
      setPost(updatedPost);
      toast.success('Comment deleted successfully! ✅', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error deleting comment 😞', { autoClose: 5000 });
      console.error('Delete comment error:', error);
    }
  };

  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  const addEmoji = (emoji) => {
    setCommentText((prev) => prev + emoji.native);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150 mx-auto mt-2 ml-2"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700 mt-4 animate-pulse">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">This post might have been deleted or doesn't exist.</p>
          <Link to="/" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <span className="mr-2">🏠</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Main Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Post Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              {/* Image Section */}
              <div className="relative group">
                <img
                  src={post.imageUrl || defaultImage}
                  alt={post.title}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => (e.target.src = defaultImage)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-purple-700 font-semibold rounded-full shadow-lg border border-purple-200">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {/* Title and Meta */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <img 
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${getUsername(post.userId)}`}
                        alt="Author avatar"
                        className="w-8 h-8 rounded-full mr-2 border-2 border-purple-200"
                      />
                      <span className="font-medium">{(user.username)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{moment(post.createdAt).format('MMM D, YYYY')}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-lg text-gray-700 mb-8 leading-relaxed">
                  <p>{post.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  {[
                    {
                      onClick: handleLikeToggle,
                      className: "group flex items-center px-6 py-3 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-600 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg",
                      title: user ? (liked ? 'Unlike this post' : 'Like this post') : 'Log in to like posts',
                      icon: <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill={liked ? 'red' : 'currentColor'} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
                      text: post.likes,
                      key: 'like-button'
                    },
                    {
                      onClick: () => handleShare('twitter'),
                      className: "flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-600 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg",
                      icon: <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>,
                      text: 'Twitter',
                      key: 'twitter-share'
                    },
                    {
                      onClick: () => handleShare('facebook'),
                      className: "flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-600 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg",
                      icon: <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-7h-2v-2h2v-1.5c0-2.07 1.24-3.2 3.07-3.2.88 0 1.64.07 1.86.1v2.1h-1.27c-1 0-1.2.48-1.2 1.18V12h2.4l-.31 2h-2.09v7c4.56-.93 8-4.96 8-9.8z" /></svg>,
                      text: 'Facebook',
                      key: 'facebook-share'
                    }
                  ].map((button, index) => (
                    <button
                      key={button.key || `action-btn-${index}`}
                      onClick={button.onClick}
                      className={button.className}
                      title={button.title}
                    >
                      {button.icon}
                      {button.text}
                    </button>
                  ))}
                </div>

                {/* Owner Actions */}
                {user && post.userId === user.id && (
                  <div className="flex gap-3 mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                    <Link
                      to={`/edit-post/${post.id}`}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Post
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Comments ({post.comments ? post.comments.length : 0})
                  </h3>
                </div>
              </div>

              {/* Comments List */}
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <img
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.username}`}
                            alt="Commenter avatar"
                            className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                          />
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-800">{comment.username}</h4>
                              <span className="text-sm text-gray-500 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {moment(comment.createdAt).format('MMM D, YYYY')}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                          </div>
                          {user && comment.username === user.username && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl text-gray-500 mb-2">No comments yet</p>
                  <p className="text-gray-400">Be the first to share your thoughts!</p>
                </div>
              )}

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div className="flex gap-4">
                    <img 
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`}
                      alt="Your avatar"
                      className="w-12 h-12 rounded-full border-3 border-white shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none bg-white/90 backdrop-blur-sm"
                        placeholder="Share your thoughts... ✨ Add emojis! 😄"
                        rows="4"
                      />
                      
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Post Comment
                    </button>
                    <Link
                      to="/"
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-semibold rounded-full hover:from-gray-400 hover:to-gray-500 transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      <span className="mr-2">🏠</span>
                      Back to Home
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200">
                  <div className="text-4xl mb-3">🔐</div>
                  <p className="text-lg text-gray-600 mb-4">Join the conversation!</p>
                  <Link 
                    to="/login"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Log in to comment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PostDetails;