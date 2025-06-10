import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/login', values);
      login(response.data.user, response.data.token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Login</h1>
      <div className="card bg-base-100 shadow-2xl p-8 animate-slide-up">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Email</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="email" component="div" className="text-error text-sm mb-2" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Password</span>
                </label>
                <Field
                  type="password"
                  name="password"
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="password" component="div" className="text-error text-sm mb-2" />
                <a href="#" className="text-sm text-primary mt-2">Forgot Password?</a>
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-lg ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;