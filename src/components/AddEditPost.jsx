import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddEditPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [initialValues, setInitialValues] = useState({
    title: '',
    imageUrl: '',
    description: '',
    category: 'Travel',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          setInitialValues(response.data);
          setImagePreview(response.data.imageUrl);
        } catch (error) {
          toast.error('Error fetching post 😞');
          console.error(error);
          navigate('/');
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').max(100, 'Title too long'),
    imageUrl: Yup.string().url('Invalid URL').required('Image URL is required'),
    description: Yup.string().required('Description is required').max(5000, 'Description too long'),
    category: Yup.string().required('Category is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const postData = {
        ...values,
        userId: user.id,
        createdAt: isEdit ? initialValues.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: isEdit ? initialValues.likes || 0 : 0,
        comments: isEdit ? initialValues.comments || [] : [],
      };
      if (isEdit) {
        await api.put(`/posts/${id}`, postData);
        toast.success('Post updated successfully! 🎉');
      } else {
        await api.post('/posts', postData);
        toast.success('Post created successfully! 🎉');
      }
      navigate('/');
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} post 😞`);
      console.error(error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleImageChange = (e, setFieldValue) => {
    const url = e.target.value;
    setFieldValue('imageUrl', url);
    setImagePreview(url);
  };

  const categories = ['Travel', 'Tech', 'Lifestyle'];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8 min-h-screen bg-base-100">
      {/* Sidebar Quote Widget */}
      <div className="hidden lg:block w-1/3">
        <div className="card bg-base-200 shadow-xl rounded-2xl p-6 glass">
          <h3 className="text-2xl font-bold text-center mb-4 text-gradient font-poppins">
            Inspire Your Post! 🌈
          </h3>
          <p className="text-center italic">
            "Write what should not be forgotten." — Isabel Allende 📝
          </p>
          <div className="mt-4 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              alt="Inspiration"
              className="rounded-full w-32 h-32 animate-pulse"
            />
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="card bg-base-100 shadow-2xl rounded-2xl p-8 w-full max-w-2xl glass">
        <h2 className "text-3xl font-extrabold text-center mb-6 text-gradient font-poppins">
          {isEdit ? 'Edit Your Story 📝' : 'Create a New Post 🌟'}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Title 📜</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    ✨
                  </span>
                  <Field
                    type="text"
                    name="title"
                    className="input input-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter post title..."
                  />
                </div>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Image URL 🖼️</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    📸
                  </span>
                  <Field
                    type="text"
                    name="imageUrl"
                    className="input input-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter image URL..."
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                  />
                </div>
                <ErrorMessage
                  name="imageUrl"
                  component="div"
                  className="text-error text-sm mt-1"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-full max-w-md h-48 object-cover rounded-lg shadow-md animate-slide-up"
                  />
                )}
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Description 📝</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="textarea textarea-bordered w-full rounded-lg h-40 focus:ring-2 focus:ring-primary transition-all duration-200"
                  placeholder="Write your story..."
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Category 🌈</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    🎨
                  </span>
                  <Field
                    as="select"
                    name="category"
                    className="select select-bordered w-full rounded-full pl-10 focus:ring-2 focus:ring-primary transition-all duration-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Field>
                </div>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full rounded-full hover:scale-105 transition-transform duration-200"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Submitting...' : isEdit ? 'Update Post 📝' : 'Create Post 🚀'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditPost;