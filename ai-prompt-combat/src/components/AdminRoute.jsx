import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Agar login nahi hai, YA uska role admin nahi hai, toh bahar nikalo
  if (!currentUser || userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}