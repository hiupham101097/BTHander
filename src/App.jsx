import React, { lazy, Suspense } from "react";
import RouteBoundary from "./components/ui/RouteBoundary.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
import { AuthProvider } from "./context/AuthContext.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ProjectsManager = lazy(() => import("./pages/admin/ProjectsManager.jsx"));
const Profile = lazy(() => import("./pages/admin/Profile.jsx"));
const CatalogManager = lazy(() => import("./pages/admin/CatalogManager.jsx"));
const UsersManager = lazy(() => import("./pages/admin/UsersManager.jsx"));
const ContactsManager = lazy(() => import("./pages/admin/ContactsManager.jsx"));
const BlogManager = lazy(() => import("./pages/admin/BlogManager.jsx"));
const ArticlesManager = lazy(() => import("./pages/admin/ArticlesManager.jsx"));
const MyProjectsManager = lazy(() => import("./pages/admin/MyProjectsManager.jsx"));
const MyStats = lazy(() => import("./pages/admin/MyStats.jsx"));

const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const TeamProfile = lazy(() => import("./pages/TeamProfile.jsx"));
const TeamArticles = lazy(() => import("./pages/TeamArticles.jsx").then(module => ({ default: module.TeamArticles })));
const TeamArticleDetail = lazy(() => import("./pages/TeamArticles.jsx").then(module => ({ default: module.TeamArticleDetail })));
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <RouteBoundary>
        <Suspense fallback={<div className="wrap detail-state" role="status" aria-live="polite">Đang tải trang…</div>}>
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
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <Route path="*" element={<div className="wrap detail-state"><h1>Không tìm thấy trang</h1><a className="btn-primary" href="/">Về trang chủ</a></div>} />
        </Routes>
        </Suspense>
        </RouteBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
