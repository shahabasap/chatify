import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectAuth } from '../redux/authSlice';

const ProtectPrivateRoutes = () => {
    const {token} = useSelector(selectAuth);
    const navigate = useNavigate();
    useEffect(() => {
        // Redirect to home page if token is not available (undefined, null, or empty string)
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);


    return <Outlet />;
};

export default ProtectPrivateRoutes;
