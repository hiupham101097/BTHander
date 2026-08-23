import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart2,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  UserCircle,
  Users,
  PenSquare,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import BrandLogo from "../components/ui/BrandLogo.jsx";

const PAGE_LABELS = {
  "/admin": "Tổng quan",
  "/admin/blogs": "Blog của tôi",
  "/admin/projects": "Dự án",
  "/admin/products": "Sản phẩm",
  "/admin/team": "Đội ngũ",
  "/admin/articles": "Bài viết chia sẻ",
  "/admin/users": "Quản lý tài khoản",
  "/admin/contacts": "Liên hệ",
  "/admin/profile": "Hồ sơ",
  "/admin/my-projects": "Dự án của tôi",
  "/admin/stats": "Thống kê",
  "/account": "Tài khoản",
};

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, isAdmin, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const leave = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const currentLabel = PAGE_LABELS[location.pathname] ?? "Bảng điều khiển";
  const roleLabel = isAdmin ? "Quản trị viên" : isStaff ? "Nhân viên" : "Người dùng";
  const roleBadgeClass = isAdmin ? "role-badge-admin" : isStaff ? "role-badge-staff" : "role-badge-user";
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="root admin-shell">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-brand">
          <BrandLogo compact />
          <span>{isAdmin ? "Admin Panel" : "My Portal"}</span>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {isAdmin && (
            <>
              <div className="admin-nav-section-label">Tổng quan</div>
              <NavItem end to="/admin" icon={LayoutDashboard} label="Dashboard" />
            </>
          )}

          {/* Nội dung – cả admin và staff */}
          <div className="admin-nav-section-label">Nội dung</div>
          {(isAdmin || isStaff) && (
            <NavItem to="/admin/blogs" icon={PenSquare} label="Blog của tôi" />
          )}
          {(isAdmin || isStaff) && (
            <NavItem to="/admin/my-projects" icon={FolderKanban} label="Dự án của tôi" />
          )}
          {(isAdmin || isStaff) && (
            <NavItem to="/admin/stats" icon={TrendingUp} label="Thống kê bài viết" />
          )}

          {/* Admin only */}
          {isAdmin && (
            <>
              <div className="admin-nav-section-label">Quản lý</div>
              <NavItem to="/admin/projects" icon={FolderKanban} label="Tất cả dự án" />
              <NavItem to="/admin/articles" icon={FileText} label="Bài viết chia sẻ" />
              <NavItem to="/admin/products" icon={Package} label="Sản phẩm" />
              <NavItem to="/admin/team" icon={Users} label="Đội ngũ" />
              <NavItem to="/admin/users" icon={ShieldCheck} label="Tài khoản" />
              <NavItem to="/admin/contacts" icon={Mail} label="Liên hệ" />
            </>
          )}

          <div className="admin-nav-section-label">Cá nhân</div>
          <NavItem
            to={isAdmin ? "/admin/profile" : "/account"}
            icon={UserCircle}
            label="Hồ sơ của tôi"
          />
        </nav>

        {/* Footer – user info + logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-avatar">{initials}</div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">{user?.name}</div>
              <div className="admin-sidebar-user-role">{roleLabel}</div>
            </div>
          </div>
          <a href="/" className="admin-back-site">
            <ExternalLink size={15} />
            <span>Xem trang chủ</span>
          </a>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-title">{currentLabel}</div>
            <div className="admin-topbar-breadcrumb">
              BTHander · {isAdmin ? "Admin" : "Staff"} Panel
            </div>
          </div>

          <div className="admin-user">
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.name}</div>
              <span className={`role-badge ${roleBadgeClass}`}>{roleLabel}</span>
            </div>
            <button className="btn-ghost admin-logout" onClick={leave}>
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
