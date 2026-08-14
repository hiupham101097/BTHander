import React, { useEffect, useState } from "react";
import { FolderKanban, Mail, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, isAdmin } = useAuth(); const [stats, setStats] = useState({ projects: "–", support: "–" });
  useEffect(() => { 
    if (!isAdmin) return;
    Promise.all([fetch("/api/projects"), fetch("/api/support", { credentials: "include" })]).then(async ([projects, support]) => setStats({ projects: projects.ok ? (await projects.json()).data.length : "–", support: support.ok ? (await support.json()).data.length : "–" })).catch(() => {}); 
  }, [isAdmin]);
  const cards = [{ icon: FolderKanban, label: "Dự án", value: stats.projects }, { icon: Mail, label: "Liên hệ hỗ trợ", value: stats.support }, { icon: Users, label: "Tài khoản đang dùng", value: 1 }];
  return (
    <>
      <p className="admin-welcome">Xin chào, <strong>{user.name}</strong>. Đây là khu vực quản trị BThander.</p>
      {isAdmin ? (
        <div className="admin-cards">{cards.map(({ icon: Icon, label, value }) => <div className="admin-card" key={label}><div className="admin-card-icon"><Icon size={20} /></div><div className="admin-card-value">{value}</div><div className="admin-card-label">{label}</div></div>)}</div>
      ) : (
        <div className="admin-staff-welcome">
          <p>Bạn đang đăng nhập với quyền Nhân viên. Bạn có thể quản lý Blog cá nhân của mình từ menu bên trái.</p>
        </div>
      )}
    </>
  );
}
