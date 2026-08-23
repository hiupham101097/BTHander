import React, { useEffect, useState } from "react";
import { FileText, PenSquare, TrendingUp, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

function StatsCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="stats-card">
      <div className="stats-card-icon"><Icon size={18} /></div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-label">{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function MyStats() {
  const [posts, setPosts] = useState([]);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    fetch("/api/posts", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((b) => { setPosts(b.data || []); setLoadState("ready"); })
      .catch(() => setLoadState("ready"));
  }, []);

  const total = posts.length;
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  /* Estimate word count from content blocks */
  const avgWords = (() => {
    if (!total) return 0;
    const totalWords = posts.reduce((acc, post) => {
      try {
        const blocks = JSON.parse(post.content || "[]");
        const words = blocks
          .filter((b) => b.type === "text" || b.type === "heading")
          .map((b) => (b.content || "").split(/\s+/).filter(Boolean).length)
          .reduce((a, n) => a + n, 0);
        return acc + words;
      } catch {
        return acc + (post.content || "").split(/\s+/).filter(Boolean).length;
      }
    }, 0);
    return Math.round(totalWords / total);
  })();

  /* Sort by newest */
  const sorted = [...posts].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="stats-page">
      <div className="stats-card-grid">
        <StatsCard icon={FileText} label="Tổng bài viết" value={loadState === "loading" ? "…" : total} />
        <StatsCard icon={TrendingUp} label="Bài công khai" value={loadState === "loading" ? "…" : published} sub="Hiển thị trên trang cá nhân" />
        <StatsCard icon={PenSquare} label="Bản nháp" value={loadState === "loading" ? "…" : drafts} sub="Chưa được công khai" />
        <StatsCard icon={Clock} label="Từ trung bình / bài" value={loadState === "loading" ? "…" : avgWords} sub="Ước tính từ nội dung" />
      </div>

      {/* Articles list with detail */}
      <div className="admin-panel">
        <div className="admin-panel-title">
          <FileText size={16} /> Tất cả bài viết của bạn
        </div>

        {loadState === "loading" && <p className="api-state">Đang tải…</p>}

        <div className="admin-panel-list">
          {sorted.map((post) => {
            /* Estimate word count for this post */
            let wordCount = 0;
            try {
              const blocks = JSON.parse(post.content || "[]");
              wordCount = blocks
                .filter((b) => b.type === "text" || b.type === "heading")
                .map((b) => (b.content || "").split(/\s+/).filter(Boolean).length)
                .reduce((a, n) => a + n, 0);
            } catch {
              wordCount = (post.content || "").split(/\s+/).filter(Boolean).length;
            }

            return (
              <div className="admin-panel-item" key={post.id}>
                <div className="admin-panel-item-left">
                  <div className="admin-panel-item-icon">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="admin-panel-item-name">{post.title}</div>
                    <div className="admin-panel-item-sub" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Clock size={11} />
                      {new Date(post.created_at).toLocaleDateString("vi-VN")}
                      <span>·</span>
                      ~{wordCount} từ
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`status-pill ${post.status === "published" ? "status-pill-published" : "status-pill-draft"}`}>
                    {post.status === "published" ? "Công khai" : "Nháp"}
                  </span>
                  <Link
                    to="/admin/blogs"
                    className="icon-btn"
                    title="Chỉnh sửa"
                    style={{ textDecoration: "none" }}
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            );
          })}

          {!sorted.length && loadState === "ready" && (
            <div className="admin-panel-empty">
              Chưa có bài viết nào. <Link to="/admin/blogs" style={{ color: "var(--accent)", fontWeight: 700 }}>Viết bài ngay →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
