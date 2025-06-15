import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password is too long'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.get(`/users?email=${encodeURIComponent(values.email)}&password=${encodeURIComponent(values.password)}`);
      if (response.data.length === 0) {
        throw new Error('Invalid email or password');
      }
      const user = response.data[0];
      login(user, 'fake-token-' + user.id);
      toast.success('Logged in successfully! 🎉', { autoClose: 5000 });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      toast.error('Invalid email or password 😞', { autoClose: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row items-center gap-8 min-h-screen bg-base-100">
      <div className="hidden lg:block w-1/2">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Login Illustration"
          className="rounded-2xl shadow-xl animate-float"
        />
      </div>
      <div className="card bg-base-100 shadow-2xl rounded-2xl p-8 w-full max-w-md glass">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient font-poppins">
          Login to Zag's Blog 🔐
        </h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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
                    placeholder="Enter your email... 📧"
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
                    placeholder="Enter your password... 🔒"
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
                {isSubmitting ? 'Logging in...' : 'Login 🚀'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Signup 🌟
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;