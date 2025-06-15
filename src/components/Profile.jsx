import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [postsResponse, usersResponse] = await Promise.all([
            api.get(`/posts?userId=${user.id}`),
            api.get('/users'),
          ]);
          console.log('Users data:', usersResponse.data); 
          if (!usersResponse.data || usersResponse.data.length === 0) {
            console.warn('No users data received from API');
            setUsers([]);
          } else {
            setUsers(usersResponse.data);
          }
          setPosts(postsResponse.data || []);
        } catch (error) {
          toast.error('Error fetching data 😞', { autoClose: 10000 });
          console.error('Fetch data error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username too short')
      .max(20, 'Username too long')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, underscores'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .lowercase('Email must be lowercase'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password too long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .optional(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Submitting form with values:', values);
    if (!user || !user.id) {
      toast.error('User ID is missing. Please log in again 😞', { autoClose: 10000 });
      setSubmitting(false);
      return;
    }
    try {
      const updatedUser = {
        ...user,
        username: values.username,
        email: values.email,
        password: values.password || user.password,
        updatedAt: new Date().toISOString(),
      };
      console.log('Sending update to API:', updatedUser);
      const response = await api.put(`/users/${user.id}`, updatedUser);
      console.log('API Response:', response.data);
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }
      updateUser(response.data); // تحديث الـ AuthContext
      toast.success('Profile updated successfully! 🎉', { autoClose: 10000 });
      setShowEditForm(false);
    } catch (error) {
      console.error('Update error details:', error.response?.data || error.message);
      toast.error(`Error updating profile 😞: ${error.message}`, { autoClose: 10000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully ✅', { autoClose: 10000 });
    } catch (error) {
      toast.error('Error deleting post 😞', { autoClose: 10000 });
      console.error('Delete error:', error);
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white backdrop-blur-lg rounded-3xl shadow-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Please log in to view your profile 😊</h2>
          <Link to="/login" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Login 🔐
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-xl">
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${getUsername(user.id)}`} alt="Profile" className="w-full h-full" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {getUsername(user.id)}
              </h1>
              <p className="text-gray-600 text-lg mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">{user.role}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                jsx={showEditForm ? 'true' : 'false'}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                {showEditForm ? 'Cancel ❌' : 'Edit Profile ✏️'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {showEditForm && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-purple-800 mb-6">Edit Profile ✨</h3>
            <Formik
              initialValues={{ username: user.username, email: user.email, password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Username 👤</label>
                    <Field
                      type="text"
                      name="username"
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter username..."
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email ✉️</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter email..."
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Password 🔒 (Leave blank to keep current)</label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter new password..."
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    jsx={isSubmitting ? 'true' : 'false'}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes 🚀'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-purple-800 mb-6">Your Posts 📝</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">You haven't created any posts yet.</p>
              <Link 
                to="/add-post" 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Post 🚀
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white/70 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <img
                    src={post.imageUrl || defaultImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = defaultImage)}
                  />
                  <div className="p-6">
                    <Link to={`/post/${post.id}`} className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors block mb-3">
                      {post.title} 🌟
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      📅 {moment(post.createdAt).format('MMM D, YYYY')}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2 px-4 rounded-xl text-center font-medium hover:shadow-lg transition-all"
                      >
                        Edit ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        jsx={post.id ? 'true' : 'false'}
                        className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Profile;