import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <main className="admin-loading">Đang tải tài khoản…</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/account" replace />;
  return children;
}
