import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        toast.error('Error fetching post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      await api.put(`/posts/${id}`, { ...post, likes: post.likes + 1 });
      setPost({ ...post, likes: post.likes + 1 });
      toast.success('Post liked!');
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const handleComment = async (values, { resetForm }) => {
    try {
      const newComment = {
        content: values.comment,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      const updatedComments = [...(post.comments || []), newComment];
      await api.put(`/posts/${id}`, { ...post, comments: updatedComments });
      setPost({ ...post, comments: updatedComments });
      toast.success('Comment added!');
      resetForm();
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const commentSchema = Yup.object({
    comment: Yup.string().required('Comment is required').max(500, 'Comment too long'),
  });

  if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!post) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="card bg-base-100 shadow-2xl rounded-xl animate-slide-up">
        <figure>
          <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover" />
        </figure>
        <div className="card-body p-8">
          <h1 className="card-title text-4xl font-extrabold mb-4">{post.title}</h1>
          <p className="text-base-content/70 mb-4">{post.description}</p>
          <p className="text-sm font-medium text-primary">By User {post.userId}</p>
          <p className="text-sm text-base-content/60">Posted: {moment(post.createdAt).format('MMM D, YYYY')}</p>
          <p className="text-sm text-base-content/60">Last updated: {moment(post.updatedAt).format('MMM D, YYYY')}</p>
          <div className="flex items-center gap-4 mt-4">
            <button onClick={handleLike} className="btn btn-ghost btn-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {post.likes}
            </button>
          </div>
          {user && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Comments</h3>
              <Formik
                initialValues={{ comment: '' }}
                validationSchema={commentSchema}
                onSubmit={handleComment}
              >
                <Form className="form-control">
                  <Field
                    as="textarea"
                    name="comment"
                    className="textarea textarea-bordered w-full rounded-lg mb-2"
                    placeholder="Add a comment..."
                  />
                  <ErrorMessage name="comment" component="div" className="text-error text-sm mb-2" />
                  <button type="submit" className="btn btn-primary rounded-full">Post Comment</button>
                </Form>
              </Formik>
              <div className="mt-6 space-y-4">
                {(post.comments || []).map((comment, index) => (
                  <div key={index} className="card bg-base-200 p-4">
                    <p className="text-base-content">{comment.content}</p>
                    <p className="text-sm text-base-content/60">By User {comment.userId} on {moment(comment.createdAt).format('MMM D, YYYY')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;