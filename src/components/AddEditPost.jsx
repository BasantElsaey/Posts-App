import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const AddEditPost = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Travel',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access this page! 🔐', { autoClose: 5000 });
      navigate('/login');
      return;
    }
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          if (response.data.userId !== user.id) {
            toast.error('You can only edit your own posts! 🔐', { autoClose: 5000 });
            navigate('/');
            return;
          }
          setInitialValues({
            title: response.data.title,
            description: response.data.description,
            imageUrl: response.data.imageUrl || '',
            category: response.data.category,
            createdAt: response.data.createdAt,
            likes: response.data.likes,
            comments: response.data.comments,
          });
          setImagePreview(response.data.imageUrl || '');
        } catch (error) {
          toast.error('Error fetching post 😞', { autoClose: 5000 });
          console.error('Fetch post error:', error);
          navigate('/');
        }
      };
      fetchPost();
    }
  }, [id, user, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title too short')
      .max(100, 'Title too long'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description too short'),
    imageUrl: Yup.string()
      .url('Invalid URL')
      .required('Image is required'),
    category: Yup.string().required('Category is required'),
  });

  const handleImageUpload = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit 😞', { autoClose: 5000 });
      return;
    }

    if (!import.meta.env.VITE_IMGBB_API_KEY) {
      toast.error('ImgBB API key is missing 😞', { autoClose: 5000 });
      console.error('VITE_IMGBB_API_KEY is not defined in .env');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

    try {
      setUploading(true);
      const response = await axios.post('https://api.imgbb.com/1/upload', formData);
      const imageUrl = response.data.data.url;
      setFieldValue('imageUrl', imageUrl);
      setImagePreview(imageUrl);
      toast.success('Image uploaded successfully! 🖼️', { autoClose: 5000 });
    } catch (error) {
      toast.error('Error uploading image 😞', { autoClose: 5000 });
      console.error('ImgBB upload error:', error.response ? error.response.data : error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!values.imageUrl) {
      toast.error('Please upload an image before submitting 😞', { autoClose: 5000 });
      setSubmitting(false);
      return;
    }
    try {
      const postData = {
        ...values,
        userId: user.id,
        createdAt: id ? values.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: id ? values.likes : 0,
        comments: id ? values.comments : [],
      };
      if (id) {
        await api.put(`/posts/${id}`, postData);
        toast.success('Post updated successfully! 🎉', { autoClose: 7000 });
      } else {
        await api.post(`/posts`, postData);
        toast.success('Post created successfully! 🎉', { autoClose: 7000 });
      }
      setTimeout(() => navigate('/'), 7000);
    } catch (error) {
      toast.error('Error saving post 😞', { autoClose: 5000 });
      console.error('Save post error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-base-100">
      <div className="card bg-base-100 shadow-xl rounded-2xl p-8 glass max-w-2xl mx-auto animate-slide-up">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gradient font-poppins">
          {id ? 'Edit Post 📝' : 'Create New Post 🌟'}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title ✍️</span>
                </label>
                <Field
                  type="text"
                  name="title"
                  className="input input-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                  placeholder="Enter post title... 📜"
                />
                <ErrorMessage name="title" component="div" className="text-error text-sm mt-1" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description 📜</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="textarea textarea-bordered w-full rounded-2xl focus:ring-2 focus:ring-primary"
                  placeholder="Write your story... 📝"
                  rows="5"
                />
                <ErrorMessage name="description" component="div" className="text-error text-sm mt-1" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image 🖼️</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageUpload(event, setFieldValue)}
                  className="file-input file-input-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                />
                {uploading && <span className="loading loading-spinner text-primary mt-2"></span>}
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
                <ErrorMessage name="imageUrl" component="div" className="text-error text-sm mt-1" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category 🏷️</span>
                </label>
                <Field
                  as="select"
                  name="category"
                  className="select select-bordered w-full rounded-full focus:ring-2 focus:ring-primary"
                >
                  <option value="Travel">Travel ✈️</option>
                  <option value="Tech">Tech 💻</option>
                  <option value="Lifestyle">Lifestyle 🌿</option>
                  <option value="Food">Food 🍽️</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-error text-sm mt-1" />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full rounded-full hover:scale-105 transition-transform"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting ? 'Saving...' : id ? 'Update Post 🚀' : 'Create Post 🚀'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditPost;