import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access this page! 🔐', { autoClose: 5000 });
      console.log('No user found, redirecting to login from:', location.pathname);
    }
  }, [user, location]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;