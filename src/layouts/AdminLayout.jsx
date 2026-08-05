import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ExternalLink, FolderKanban, LayoutDashboard, LogOut, Mail, Package, ShieldCheck, UserCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import BrandLogo from "../components/ui/BrandLogo.jsx";

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const leave = async () => { await logout(); navigate("/login", { replace: true }); };
  return <div className="root admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><BrandLogo compact /><span>Admin</span></div>
      <nav className="admin-nav">
        {isAdmin && <NavLink end to="/admin" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><LayoutDashboard size={17} />Tổng quan</NavLink>}
        {isAdmin && <NavLink to="/admin/projects" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><FolderKanban size={17} />Dự án</NavLink>}
        {isAdmin && <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><Package size={17} />Sản phẩm</NavLink>}
        {isAdmin && <NavLink to="/admin/team" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><Users size={17} />Đội ngũ</NavLink>}
        {isAdmin && <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><ShieldCheck size={17} />Tài khoản</NavLink>}
        {isAdmin && <NavLink to="/admin/contacts" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><Mail size={17} />Thông tin liên hệ</NavLink>}
        <NavLink to="/admin/profile" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}><UserCircle size={17} />Hồ sơ của tôi</NavLink>
      </nav>
      <a href="/" className="admin-nav-link admin-back-site"><ExternalLink size={17} />Xem trang chủ</a>
    </aside>
    <div className="admin-main"><header className="admin-topbar"><div className="admin-topbar-title">Bảng điều khiển</div><div className="admin-user"><div className="admin-user-info"><div className="admin-user-name">{user.name}</div><span className="role-badge">{isAdmin ? "Quản lý" : "Người dùng"}</span></div><button className="btn-ghost admin-logout" onClick={leave}><LogOut size={15} />Đăng xuất</button></div></header><div className="admin-content"><Outlet /></div></div>
  </div>;
}
