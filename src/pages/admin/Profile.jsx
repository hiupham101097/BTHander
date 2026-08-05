import React from "react";
import { Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
export default function Profile() { const { user, isAdmin } = useAuth(); return <div><h2 className="admin-section-title profile-heading">Hồ sơ của tôi</h2><div className="profile-card"><div className="profile-avatar"><User size={26} /></div><div><div className="profile-name">{user.name}</div><div className="profile-meta"><Mail size={13} />{user.email}</div><span className="role-badge">{isAdmin ? "Quản lý" : "Người dùng"}</span></div></div></div>; }
