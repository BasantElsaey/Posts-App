import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

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
      await api.put(`/users/${user.id}`, updatedUser);
      updateUser(updatedUser);
      toast.success('Profile updated successfully! 🎉', { autoClose: 5000 });
      setShowEditForm(false);
    } catch (error) {
      toast.error('Error updating profile 😞', { autoClose: 5000 });
      console.error('Update profile error:', error);
    } finally {
      setSubmitting(false);
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
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <div className="card bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} alt="Profile" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-extrabold text-blue-600">{user.username}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
            <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="btn btn-primary btn-sm rounded-full mt-4 hover:bg-blue-700"
            >
              {showEditForm ? 'Cancel' : 'Edit Profile ✏️'}
            </button>
          </div>
        </div>

        {showEditForm && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Edit Profile</h3>
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
                <Form className="space-y-0">
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Username 👤</span>
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username..."
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Email ✉️</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email..."
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Password 🔒 (Leave blank to keep current)</span>
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="input input-bordered w-full rounded-lg focus:ring-blue-500"
                      placeholder="Enter new password..."
                    />
                    <ErrorMessage name="password" component="div" class="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-blue-600 w-full rounded-full hover:bg-blue-700"
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
          <h3 className="text-2xl font-bold mb-6 text-blue-800">Your Posts 📝</h3>
          {loading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-lg text-gray-600 text-center">
              You haven't created any posts yet.{' '}
              <Link to="/add-post" className="text-blue-600 hover:underline">Create one now! 🚀</Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card bg-gray-50 shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{post.category}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/post/${post.id}`}
                    className="btn btn-blue-600 btn-sm mt-4 rounded-full w-full"
                  >
                    View Post 👀
                  </Link>
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