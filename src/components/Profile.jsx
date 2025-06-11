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
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const defaultImage = 'https://via.placeholder.com/800x600?text=Image+Not+Found';

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const response = await api.get(`/posts?userId=${user.id}`);
          setPosts(response.data);
        } catch (error) {
          toast.error('Error fetching posts 😞', { autoClose: 5000 });
          console.error('Fetch posts error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
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
    try {
      const updatedUser = {
        ...user,
        username: values.username,
        email: values.email,
        password: values.password || user.password,
        updatedAt: new Date().toISOString(),
      };
      const response = await api.put(`/users/${user.id}`, updatedUser);
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }
      console.log('API response for update user:', response.data);
      updateUser(response.data);
      toast.success('Profile updated successfully! 🎉', { autoClose: 7000 });
      setShowEditForm(false);
    } catch (error) {
      toast.error('Error updating profile 😞', { autoClose: 5000 });
      console.error('Update profile error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully ✅', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error deleting post 😞', { autoClose: 5000 });
      console.error('Delete error:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-error">Please log in to view your profile 😊</h2>
        <Link to="/login" className="btn btn-primary mt-4 rounded-full">Login 🔐</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-base-100">
      <div className="card bg-base-100 shadow-xl rounded-2xl p-8 glass max-w-4xl mx-auto animate-slide-up">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} alt="Profile" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-extrabold text-gradient font-poppins">{user.username}</h2>
            <p className="text-lg text-base-content/80">{user.email}</p>
            <p className="text-sm text-base-content/60 capitalize">Role: {user.role}</p>
            <p className="text-sm text-base-content/60">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="btn btn-primary btn-sm rounded-full mt-4 hover:scale-105 transition-transform"
            >
              {showEditForm ? 'Cancel 🚫' : 'Edit Profile ✏️'}
            </button>
          </div>
        </div>

        {showEditForm && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gradient font-poppins">Edit Profile 🌟</h3>
            <Formik
              initialValues={{
                username: user.username,
                email: user.email,
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Username 👤</span>
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="input input-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                      placeholder="Enter username... 👤"
                    />
                    <ErrorMessage name="username" component="div" className="text-error text-sm mt-1" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email ✉️</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="input input-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                      placeholder="Enter email... ✉️"
                    />
                    <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password 🔒 (Leave blank to keep current)</span>
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="input input-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                      placeholder="Enter new password... 🔒"
                    />
                    <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full rounded-full hover:scale-105 transition-transform"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes 🚀'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-6 text-gradient font-poppins">Your Posts 📝</h3>
          {loading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-lg text-base-content/70 text-center">
              You haven't created any posts yet.{' '}
              <Link to="/add-post" className="text-primary hover:underline">Create one now! 🚀</Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card bg-base-100 shadow-md rounded-2xl p-4 hover:shadow-xl transition-all duration-300"
                >
                  <figure>
                    <img
                      src={post.imageUrl || defaultImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => (e.target.src = defaultImage)}
                    />
                  </figure>
                  <div className="card-body p-4">
                    <Link
                      to={`/post/${post.id}`}
                      className="card-title text-xl font-semibold hover:text-primary font-poppins"
                    >
                      {post.title} 🌟
                    </Link>
                    <p className="text-base-content/70 line-clamp-2">{post.description}</p>
                    <p className="text-sm text-base-content/60">
                      Posted: {moment(post.createdAt).format('MMM D, YYYY')} 📅
                    </p>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;