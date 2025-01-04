import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectAuth } from '../redux/authSlice';

const ProtectPublicRoutes = () => {
  const {token} = useSelector(selectAuth);
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to the dashboard if the user is already authenticated
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]); // Re-run when the token changes

  return <Outlet />;
};

export default ProtectPublicRoutes;
