import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .lowercase('Email must be lowercase'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password is too long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const checkUser = await api.get(`/users?email=${encodeURIComponent(values.email)}`);
      if (checkUser.data.length > 0) {
        toast.error('Email already exists 😞', { autoClose: 9000 });
        return;
      }
      const response = await api.post('/users', {
        ...values,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      login(response.data, 'fake-token');
      toast.success('Signed up successfully! 🎉', { autoClose: 9000 });
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.error || 'Error signing up 😞', { autoClose: 9000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row items-center gap-8 min-h-screen bg-base-100">
      <div className="hidden lg:block w-1/2">
        <img
          src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Signup Illustration"
          className="rounded-2xl shadow-xl animate-float"
        />
      </div>
      <div className="card bg-base-100 shadow-2xl rounded-2xl p-8 w-full max-w-md glass">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient font-poppins">
          Join Zag's Blog! 🌟
        </h2>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Username 👤</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    😊
                  </span>
                  <Field
                    type="text"
                    name="username"
                    className="input input-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter your username..."
                  />
                </div>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Email ✉️</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    📧
                  </span>
                  <Field
                    type="email"
                    name="email"
                    className="input input-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter your email..."
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password 🔒</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    🔐
                  </span>
                  <Field
                    type="password"
                    name="password"
                    className="input input-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter your password..."
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full rounded-full hover:scale-105 transition-transform duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Signup 🌈'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login 🔑
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;