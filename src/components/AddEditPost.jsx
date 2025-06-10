import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddEditPost = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Mock fetching post data
      const mockPost = {
        id,
        title: 'Sample Post',
        imageUrl: 'https://via.placeholder.com/400x200',
        description: 'Sample description',
      };
      setFormData(mockPost);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(isEdit ? 'Post updated successfully' : 'Post created successfully');
      setLoading(false);
      navigate('/');
    }, 1000); // Simulate API call
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{isEdit ? 'Edit Post' : 'Add Post'}</h1>
      <div className="card bg-base-100 shadow-xl p-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows="5"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : isEdit ? 'Update Post' : 'Add Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditPost;