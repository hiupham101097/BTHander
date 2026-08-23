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
import ContactsManager from "./pages/admin/ContactsManager.jsx";
import BlogManager from "./pages/admin/BlogManager.jsx";
import ArticlesManager from "./pages/admin/ArticlesManager.jsx";
import MyProjectsManager from "./pages/admin/MyProjectsManager.jsx";
import MyStats from "./pages/admin/MyStats.jsx";

import ProjectDetail from "./pages/ProjectDetail.jsx";
import TeamProfile from "./pages/TeamProfile.jsx";
import { TeamArticleDetail, TeamArticles } from "./pages/TeamArticles.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            {/* Team profile routes – no longer go through MemberDetail */}
            <Route path="/team/:id" element={<TeamProfile />} />
            <Route path="/team/:id/articles" element={<TeamArticles />} />
            <Route path="/team/:id/articles/:articleId" element={<TeamArticleDetail />} />
          </Route>

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Admin panel (admin + staff) ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard – shows different view based on role */}
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin-only */}
            <Route
              path="projects"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProjectsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CatalogManager kind="products" />
                </ProtectedRoute>
              }
            />
            <Route
              path="team"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CatalogManager kind="team" />
                </ProtectedRoute>
              }
            />
            <Route
              path="articles"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ArticlesManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="contacts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ContactsManager />
                </ProtectedRoute>
              }
            />

            {/* Admin + Staff */}
            <Route
              path="blogs"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <BlogManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-projects"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <MyProjectsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="stats"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <MyStats />
                </ProtectedRoute>
              }
            />

            {/* Profile – accessible by all logged in */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ── Account (non-admin portal) ── */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
