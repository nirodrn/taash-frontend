import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/authUtils';  // Import the utility

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('role'); // Assuming the role is stored in localStorage after login

  // If there's no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the route is admin-only and the user is not an admin, redirect to login
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
