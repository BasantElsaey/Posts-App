import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddEditPost = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
    category: 'Travel',
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          setFormData(response.data);
          setImagePreview(response.data.imageUrl);
        } catch (error) {
          toast.error('Error fetching post');
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, formData);
        toast.success('Post updated successfully');
      } else {
        await api.post('/posts', { ...formData, userId: user.id });
        toast.success('Post created successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} post`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const categories = ['Travel', 'Tech', 'Lifestyle'];

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </h1>
      <div className="card bg-base-100 shadow-2xl p-8 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full rounded-lg"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Category</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input input-bordered w-full rounded-lg"
              required
            />
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
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full rounded-lg"
              rows="8"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full rounded-lg ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditPost;