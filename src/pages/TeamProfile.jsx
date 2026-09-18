import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Mail,
  MapPin,
  Globe,
  UserRound,
  FolderKanban,
  ChevronRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

/* ── Article mini card ── */
function ArticleCard({ article, memberId }) {
  return (
    <Link to={`/team/${memberId}/articles/${article.id}`} className="member-article-card">
      {article.thumbnail && (
        <img src={article.thumbnail} alt={article.title} className="member-article-card-thumb" />
      )}
      <div className="member-article-card-title">{article.title}</div>
      <div className="member-article-card-date">
        {new Date(article.created_at).toLocaleDateString("vi-VN")}
      </div>
      {article.excerpt && (
        <div className="member-article-card-excerpt">{article.excerpt}</div>
      )}
      <div className="member-article-card-cta">Đọc bài →</div>
    </Link>
  );
}

export default function TeamProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [articles, setArticles] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setState("loading");
    try {
      const [memberRes, articlesRes] = await Promise.all([
        fetch(`/api/team/${id}`),
        fetch(`/api/team/${id}/articles`),
      ]);
      if (!memberRes.ok) { setState("error"); return; }
      const memberBody = await memberRes.json();
      const memberData = memberBody.data;
      setMember(memberData);

      let list = [];
      if (articlesRes.ok) {
        const articlesBody = await articlesRes.json();
        list = articlesBody.data || [];
      }

      // Merge memberData.posts if any post is not yet included in list
      if (Array.isArray(memberData?.posts)) {
        const existingIds = new Set(list.map((a) => a.id));
        const existingTitles = new Set(list.map((a) => a.title?.trim().toLowerCase()));
        for (const p of memberData.posts) {
          if (!existingIds.has(p.id) && !existingTitles.has(p.title?.trim().toLowerCase())) {
            list.push(p);
          }
        }
      }

      setArticles(list);
      setState("ready");
    } catch {
      setState("error");
    }
  }

  if (state === "loading") {
    return (
      <div className="wrap detail-state">
        <p style={{ color: "#94a3b8" }}>Đang tải hồ sơ thành viên…</p>
      </div>
    );
  }
  if (state === "error" || !member) {
    return (
      <div className="wrap detail-state">
        <p style={{ color: "#ef4444" }}>Không tìm thấy thành viên này.</p>
        <Link to="/#team" style={{ color: "#64748b", fontSize: 14 }}>← Quay lại đội ngũ</Link>
      </div>
    );
  }

  const skills = Array.isArray(member.skills) ? member.skills : (member.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const experience = Array.isArray(member.experience) ? member.experience : [];
  const featuredProjects = Array.isArray(member.featured_projects) ? member.featured_projects : [];
  const publishedArticles = articles.filter((a) => a.status === "published");

  return (
    <div className="member-profile-v2">
      {/* ── Cover ── */}
      <div className="member-cover">
        {member.cover_url && <img src={member.cover_url} alt="Cover" />}
      </div>

      {/* ── Header with floating avatar ── */}
      <div className="member-profile-header-v2">
        <div className="member-avatar-v2">
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={member.name} />
          ) : (
            <UserRound size={46} />
          )}
        </div>
        <div className="member-profile-identity">
          <h1 className="member-profile-name">{member.name}</h1>
          <div className="member-profile-title">{member.title}</div>
          <div className="member-profile-actions">
            <Link to="/#team" className="btn-ghost" style={{ fontSize: 13, padding: "9px 16px" }}>
              <ArrowLeft size={14} /> Quay lại đội ngũ
            </Link>
            {publishedArticles.length > 0 && (
              <Link
                to={`/team/${id}/articles`}
                className="btn-primary"
                style={{ fontSize: 13, padding: "9px 16px" }}
              >
                <FileText size={14} /> {publishedArticles.length} bài viết
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="member-profile-content" style={{ marginTop: 40 }}>
        {/* Sidebar */}
        <aside className="member-profile-sidebar">
          {/* Contact info */}
          <div className="member-info-card">
            <div className="member-info-card-title">Thông tin</div>

            {member.contact_info && (
              <div className="member-info-item">
                <Mail size={15} />
                <span>{member.contact_info}</span>
              </div>
            )}

            {member.location && (
              <div className="member-info-item">
                <MapPin size={15} />
                <span>{member.location}</span>
              </div>
            )}

            {member.website && (
              <div className="member-info-item">
                <Globe size={15} />
                <a href={member.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {member.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {!member.contact_info && !member.location && !member.website && (
              <div className="member-info-item" style={{ color: "#94a3b8", fontSize: 13 }}>
                Chưa có thông tin liên hệ.
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="member-info-card">
              <div className="member-info-card-title">Kỹ năng & Chuyên môn</div>
              <div className="member-skills-badges">
                {skills.map((skill, idx) => (
                  <span key={idx} className="member-skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="member-profile-main">
          {/* Bio */}
          {(member.profile_intro || member.bio) && (
            <div className="member-section-v2">
              <div className="member-section-v2-title">
                <UserRound size={17} /> Giới thiệu
              </div>
              <p className="member-bio-text">
                {member.profile_intro || member.bio}
              </p>
            </div>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <div className="member-section-v2">
              <div className="member-section-v2-title">
                <BriefcaseBusiness size={17} /> Kinh nghiệm
              </div>
              <div className="exp-timeline">
                {experience.map((exp, idx) => (
                  <div className="exp-item" key={idx}>
                    <div className="exp-marker">
                      <div className="exp-dot" />
                      {idx < experience.length - 1 && <div className="exp-line" />}
                    </div>
                    <div className="exp-content">
                      <p className="exp-content-text">{exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="member-section-v2">
              <div className="member-section-v2-title">
                <FolderKanban size={17} /> Dự án tiêu biểu
              </div>
              <div className="member-projects-grid">
                {featuredProjects.map((proj, idx) => (
                  <div key={idx} className="member-project-card">{proj}</div>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {publishedArticles.length > 0 && (
            <div className="member-section-v2">
              <div className="member-section-v2-title" style={{ justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <FileText size={17} /> Góc chia sẻ kinh nghiệm
                </span>
                {publishedArticles.length > 4 && (
                  <Link
                    to={`/team/${id}/articles`}
                    style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Xem tất cả <ChevronRight size={13} />
                  </Link>
                )}
              </div>
              <div className="member-articles-grid">
                {publishedArticles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} memberId={id} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!member.profile_intro && !member.bio && experience.length === 0 && featuredProjects.length === 0 && publishedArticles.length === 0 && (
            <div className="member-section-v2" style={{ textAlign: "center", padding: "40px 24px" }}>
              <UserRound size={40} style={{ color: "#cbd5e1", marginBottom: 12 }} />
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Thành viên này chưa cập nhật hồ sơ.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
