import React, { useEffect, useState } from "react";
import {
  FileText,
  FolderKanban,
  Mail,
  PenSquare,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/* ── Helper ── */
function StatCard({ icon: Icon, label, value, color = "accent" }) {
  return (
    <div className="admin-card">
      <div className="admin-card-icon">
        <Icon size={20} />
      </div>
      <div className="admin-card-value">{value}</div>
      <div className="admin-card-label">{label}</div>
    </div>
  );
}

function PanelList({ title, icon: Icon, items, renderItem, empty }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-title">
        <Icon size={16} />
        {title}
      </div>
      <div className="admin-panel-list">
        {items.length === 0 && (
          <div className="admin-panel-empty">{empty}</div>
        )}
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  );
}

/* ── Admin Dashboard ── */
function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    projects: "–",
    team: "–",
    contacts: "–",
    articles: "–",
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.ok ? r.json() : { data: [] }),
      fetch("/api/team").then((r) => r.ok ? r.json() : { data: [] }),
      fetch("/api/support", { credentials: "include" }).then((r) => r.ok ? r.json() : { data: [] }),
      fetch("/api/articles", { credentials: "include" }).then((r) => r.ok ? r.json() : { data: [] }),
    ])
      .then(([projects, team, contacts, articles]) => {
        const pData = projects.data || [];
        const cData = contacts.data || [];
        setStats({
          projects: pData.length,
          team: (team.data || []).length,
          contacts: cData.length,
          articles: (articles.data || []).length,
        });
        setRecentProjects(pData.slice(0, 5));
        setRecentContacts(cData.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <p className="admin-welcome">
        Chào mừng trở lại, <strong>{user.name}</strong> 👋 — Đây là tổng quan hệ thống BTHander.
      </p>

      {/* Stats */}
      <div className="admin-cards">
        <StatCard icon={FolderKanban} label="Tổng dự án" value={stats.projects} />
        <StatCard icon={Users} label="Thành viên đội ngũ" value={stats.team} />
        <StatCard icon={Mail} label="Liên hệ / Hỗ trợ" value={stats.contacts} />
        <StatCard icon={FileText} label="Bài viết chia sẻ" value={stats.articles} />
      </div>

      {/* Dashboard grid */}
      <div className="admin-dashboard-grid">
        <PanelList
          title="Dự án gần đây"
          icon={FolderKanban}
          items={recentProjects}
          empty="Chưa có dự án nào."
          renderItem={(proj, idx) => (
            <div className="admin-panel-item" key={proj.id || idx}>
              <div className="admin-panel-item-left">
                <div className="admin-panel-item-icon">
                  <FolderKanban size={14} />
                </div>
                <div>
                  <div className="admin-panel-item-name">{proj.name}</div>
                  <div className="admin-panel-item-sub">
                    {(proj.languages || []).slice(0, 3).join(", ")}
                  </div>
                </div>
              </div>
              <span className="admin-panel-item-badge">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: proj.currency || "VND",
                  maximumFractionDigits: 0,
                  notation: "compact",
                }).format(proj.price || 0)}
              </span>
            </div>
          )}
        />

        <PanelList
          title="Liên hệ mới nhận"
          icon={Mail}
          items={recentContacts}
          empty="Chưa có liên hệ nào."
          renderItem={(contact, idx) => (
            <div className="admin-panel-item" key={contact.id || idx}>
              <div className="admin-panel-item-left">
                <div className="admin-panel-item-icon">
                  <Mail size={14} />
                </div>
                <div>
                  <div className="admin-panel-item-name">{contact.name || contact.email || "Ẩn danh"}</div>
                  <div className="admin-panel-item-sub">{contact.message?.slice(0, 50)}…</div>
                </div>
              </div>
              <span className={`admin-panel-item-badge ${contact.status === "new" ? "new" : ""}`}>
                {contact.status === "new" ? "Mới" : contact.status === "in_progress" ? "Đang xử lý" : "Xong"}
              </span>
            </div>
          )}
        />
      </div>

      {/* Quick links */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/admin/projects" className="btn-ghost" style={{ fontSize: 13, padding: "10px 18px" }}>
          <FolderKanban size={15} /> Quản lý dự án <ArrowRight size={14} />
        </Link>
        <Link to="/admin/team" className="btn-ghost" style={{ fontSize: 13, padding: "10px 18px" }}>
          <Users size={15} /> Quản lý đội ngũ <ArrowRight size={14} />
        </Link>
        <Link to="/admin/articles" className="btn-ghost" style={{ fontSize: 13, padding: "10px 18px" }}>
          <FileText size={15} /> Bài viết chia sẻ <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}

/* ── Staff Dashboard ── */
function StaffDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    fetch("/api/posts", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((b) => { setPosts(b.data || []); setLoadState("ready"); })
      .catch(() => setLoadState("ready"));
  }, []);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <>
      {/* Welcome Hero */}
      <div className="staff-welcome-panel">
        <h2>Chào, {user.name} 👋</h2>
        <p>
          Đây là cổng thông tin cá nhân của bạn. Viết bài chia sẻ, quản lý dự
          án cá nhân và theo dõi hoạt động của mình tại đây.
        </p>
        <div className="staff-quick-actions">
          <Link to="/admin/blogs" className="staff-quick-btn staff-quick-btn-primary">
            <PenSquare size={15} /> Viết bài mới
          </Link>
          <Link to="/admin/my-projects" className="staff-quick-btn staff-quick-btn-ghost">
            <FolderKanban size={15} /> Dự án của tôi
          </Link>
          <Link to="/admin/stats" className="staff-quick-btn staff-quick-btn-ghost">
            <TrendingUp size={15} /> Xem thống kê
          </Link>
        </div>
      </div>

      {/* Staff stats */}
      <div className="admin-cards" style={{ marginBottom: 24 }}>
        <StatCard icon={FileText} label="Tổng bài viết" value={loadState === "loading" ? "…" : posts.length} />
        <StatCard icon={TrendingUp} label="Bài công khai" value={loadState === "loading" ? "…" : published} />
        <StatCard icon={PenSquare} label="Bản nháp" value={loadState === "loading" ? "…" : drafts} />
      </div>

      {/* Recent posts */}
      <PanelList
        title="Bài viết gần đây của bạn"
        icon={FileText}
        items={posts.slice(0, 6)}
        empty="Bạn chưa có bài viết nào. Bắt đầu viết ngay!"
        renderItem={(post, idx) => (
          <div className="admin-panel-item" key={post.id || idx}>
            <div className="admin-panel-item-left">
              <div className="admin-panel-item-icon">
                <FileText size={14} />
              </div>
              <div>
                <div className="admin-panel-item-name">{post.title}</div>
                <div className="admin-panel-item-sub" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={11} />
                  {new Date(post.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
            <span className={`status-pill ${post.status === "published" ? "status-pill-published" : "status-pill-draft"}`}>
              {post.status === "published" ? "Công khai" : "Nháp"}
            </span>
          </div>
        )}
      />
    </>
  );
}

/* ── Main Export ── */
export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  if (!user) return null;
  return isAdmin ? <AdminDashboard user={user} /> : <StaffDashboard user={user} />;
}
