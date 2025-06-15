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
      toast.error('Please log in to access this page! 🔐', { autoClose: 10000 });
      navigate('/login');
      return;
    }
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          if (response.data.userId !== user.id) {
            toast.error('You can only edit your own posts! 🔐', { autoClose: 10000 });
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
          toast.error('Error fetching post 😞', { autoClose: 10000 });
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
      toast.error('Image size exceeds 5MB limit 😞', { autoClose: 10000 });
      return;
    }

    if (!import.meta.env.VITE_IMGBB_API_KEY) {
      toast.error('ImgBB API key is missing 😞', { autoClose: 10000 });
      console.error('VITE_IMGBB_API_KEY is not defined in .env');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

    try {
      setUploading(true);
      console.log('Starting image upload...');
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        timeout: 30000,
      });
      console.log('ImgBB response:', response.data);
      const imageUrl = response.data.data.url;
      if (!imageUrl) throw new Error('No image URL returned from ImgBB');
      setFieldValue('imageUrl', imageUrl);
      setImagePreview(imageUrl);
      toast.success('Image uploaded successfully! 🖼️', { autoClose: 9000 });
    } catch (error) {
      console.error('ImgBB upload error:', error.response ? error.response.data : error.message);
      toast.error('Error uploading image 😞. Please try again or check your connection.', { autoClose: 10000 });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!values.imageUrl) {
      toast.error('Please upload an image before submitting 😞', { autoClose: 9000 });
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
        toast.success('Post updated successfully! 🎉', { autoClose: 9000 });
      } else {
        await api.post(`/posts`, postData);
        toast.success('Post created successfully! 🎉', { autoClose: 9000 });
      }
      setTimeout(() => navigate('/'), 12000);
    } catch (error) {
      toast.error('Error saving post 😞', { autoClose: 9000 });
      console.error('Save post error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-110 transition-all duration-300">
            <span className="text-3xl text-white">
              {id ? '✏️' : '✨'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {id ? 'Edit Your Story' : 'Create Something Amazing'}
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {id ? 'Polish and perfect your masterpiece' : 'Share your thoughts with the world'}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-500">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="space-y-8">
                {/* Title Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 text-white text-xs">
                      ✍️
                    </span>
                    Title
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="title"
                      className={`w-full px-6 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none transition-all duration-300 placeholder-gray-400 text-gray-800 ${
                        errors.title && touched.title 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 hover:border-gray-300'
                      }`}
                      placeholder="What's your story about? ✨"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                  </ErrorMessage>
                </div>

                {/* Description Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 text-white text-xs">
                      📝
                    </span>
                    Description
                  </label>
                  <div className="relative">
                    <Field
                      as="textarea"
                      name="description"
                      rows="6"
                      className={`w-full px-6 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none transition-all duration-300 placeholder-gray-400 text-gray-800 resize-none ${
                        errors.description && touched.description 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 hover:border-gray-300'
                      }`}
                      placeholder="Tell your story in detail... Share what makes it special! 🌟"
                    />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                  </ErrorMessage>
                </div>

                {/* Image Upload Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 text-white text-xs">
                      🖼️
                    </span>
                    Image
                  </label>
                  
                  {/* Custom File Upload */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, setFieldValue)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                      id="image-upload"
                    />
                    <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 ${
                      uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'
                    }`}>
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                          <p className="text-purple-600 font-medium">Uploading your image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl text-white">📸</span>
                          </div>
                          <p className="text-gray-700 font-medium mb-2">Drop your image here or click to browse</p>
                          <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-6 relative group">
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          ✨ Looking great!
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ErrorMessage name="imageUrl" component="div" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                  </ErrorMessage>
                </div>

                {/* Category Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3 text-white text-xs">
                      🏷️
                    </span>
                    Category
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-6 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-700 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="Travel">✈️ Travel & Adventure</option>
                      <option value="Tech">💻 Technology & Innovation</option>
                      <option value="Lifestyle">🌿 Lifestyle & Wellness</option>
                      <option value="Food">🍽️ Food & Culinary</option>
                    </Field>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                  </ErrorMessage>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="group relative w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          <span>Publishing your masterpiece...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl mr-3">{id ? '🚀' : '✨'}</span>
                          <span>{id ? 'Update Your Story' : 'Publish Your Story'}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Back Link */}
                <div className="text-center pt-4">
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 font-medium"
                  >
                    <span className="mr-2">←</span>
                    Back to Stories
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddEditPost;