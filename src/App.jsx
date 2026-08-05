import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProjectsManager from "./pages/admin/ProjectsManager.jsx";
import Profile from "./pages/admin/Profile.jsx";
import CatalogManager from "./pages/admin/CatalogManager.jsx";
import UsersManager from "./pages/admin/UsersManager.jsx";

export default function App() {
  return (
    <BrowserRouter><AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute adminOnly><ProjectsManager /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute adminOnly><CatalogManager kind="products" /></ProtectedRoute>} />
          <Route path="team" element={<ProtectedRoute adminOnly><CatalogManager kind="team" /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute adminOnly><UsersManager /></ProtectedRoute>} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider></BrowserRouter>
  );
}
