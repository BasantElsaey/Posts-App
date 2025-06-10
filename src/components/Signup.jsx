import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required').min(3, 'Username too short'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      login(response.data.user, response.data.token);
      toast.success('Signed up successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error signing up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Signup</h1>
      <div className="card bg-base-100 shadow-2xl p-8 animate-slide-up">
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Username</span>
                </label>
                <Field
                  type="text"
                  name="username"
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="username" component="div" className="text-error text-sm mb-2" />
              </div>
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
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Confirm Password</span>
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-error text-sm mb-2" />
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-lg ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;