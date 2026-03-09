import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Agar login nahi hai, toh wapas home page par phek do
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}