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
          toast.error('Error fetching post');
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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const postData = {
        ...values,
        userId: user.id,
        createdAt: isEdit ? initialValues.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: isEdit ? initialValues.likes : 0,
        comments: isEdit ? initialValues.comments : [],
      };
      if (isEdit) {
        await api.put(`/posts/${id}`, postData);
        toast.success('Post updated successfully');
      } else {
        await api.post('/posts', postData);
        toast.success('Post created successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} post`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Travel', 'Tech', 'Lifestyle'];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </h1>
      <div className="card bg-base-100 shadow-2xl p-8 rounded-xl animate-slide-up">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Title</span>
                </label>
                <Field
                  type="text"
                  name="title"
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="title" component="div" className="text-error text-sm mb-2" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Category</span>
                </label>
                <Field
                  as="select"
                  name="category"
                  className="select select-bordered w-full rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-error text-sm mb-2" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Image URL</span>
                </label>
                <Field
                  type="text"
                  name="imageUrl"
                  onChange={(e) => {
                    setFieldValue('imageUrl', e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="input input-bordered w-full rounded-lg"
                />
                <ErrorMessage name="imageUrl" component="div" className="text-error text-sm mb-2" />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Description</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="textarea textarea-bordered w-full rounded-lg h-32"
                />
                <ErrorMessage name="description" component="div" className="text-error text-sm mb-2" />
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-lg ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : isEdit ? 'Update Post' : 'Create Post'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditPost;