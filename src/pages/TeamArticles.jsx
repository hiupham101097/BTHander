import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, FileText, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";

/* ── Parse blocks (backward compatible) ── */
function parseBlocks(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* legacy plain text */ }
  return [{ type: "text", content: raw }];
}

/* ── Render block content ── */
function ArticleBlocks({ content }) {
  const blocks = parseBlocks(content);
  return (
    <div className="article-body-blocks">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return <h2 key={idx} className="article-block-heading">{block.content}</h2>;
        }
        if (block.type === "image") {
          return (
            <div key={idx} className="article-block-image">
              {block.url && <img src={block.url} alt={block.caption || ""} />}
              {block.caption && (
                <div className="article-block-image-caption">{block.caption}</div>
              )}
            </div>
          );
        }
        /* text (default) */
        return block.content ? (
          <p key={idx} className="article-block-text">{block.content}</p>
        ) : null;
      })}
    </div>
  );
}

/* ============================================================
   TeamArticles – List
   ============================================================ */
export function TeamArticles() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [member, setMember] = useState(null);
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
      if (memberRes.ok) {
        const b = await memberRes.json();
        setMember(b.data);
      }
      if (articlesRes.ok) {
        const b = await articlesRes.json();
        setArticles(b.data || []);
      }
      setState("ready");
    } catch {
      setState("ready");
    }
  }

  return (
    <main className="wrap articles-page">
      <Link to={`/team/${id}`} className="detail-back">
        <ArrowLeft size={15} /> Quay lại profile
      </Link>

      {member && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, marginTop: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
            {member.avatar_url ? <img src={member.avatar_url} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserRound size={22} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{member.name}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{member.title}</div>
          </div>
        </div>
      )}

      <h1 className="section-title">
        {articles.length > 0
          ? `${articles.length} bài viết chia sẻ`
          : "Chưa có bài viết"}
      </h1>

      {state === "loading" && <p className="api-state">Đang tải…</p>}

      <div className="article-grid" style={{ marginTop: 28 }}>
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/team/${id}/articles/${article.id}`}
            className="article-card"
          >
            {article.thumbnail && (
              <img
                src={article.thumbnail}
                alt={article.title}
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
              />
            )}
            {!article.thumbnail && <FileText size={24} style={{ color: "var(--accent)" }} />}

            <h2 style={{ fontSize: 17, margin: "10px 0 6px", lineHeight: 1.35 }}>{article.title}</h2>

            {article.excerpt && (
              <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 10px" }}>
                {article.excerpt.slice(0, 120)}{article.excerpt.length > 120 ? "…" : ""}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
              <Calendar size={12} />
              {new Date(article.created_at).toLocaleDateString("vi-VN")}
            </div>

            <span>Đọc bài viết →</span>
          </Link>
        ))}

        {!articles.length && state === "ready" && (
          <p className="api-state">Thành viên này chưa có bài viết nào.</p>
        )}
      </div>
    </main>
  );
}

/* ============================================================
   TeamArticleDetail – Newspaper style
   ============================================================ */
export function TeamArticleDetail() {
  const { id, articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  async function loadArticle() {
    setState("loading");
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      if (!res.ok) { setState("error"); return; }
      const body = await res.json();
      setArticle(body.data);
      setState("ready");

      // Load related articles from same member
      const relRes = await fetch(`/api/team/${body.data.team_member_id || id}/articles`);
      if (relRes.ok) {
        const relBody = await relRes.json();
        setRelated(
          (relBody.data || [])
            .filter((a) => a.id !== Number(articleId) && a.status === "published")
            .slice(0, 4)
        );
      }
    } catch {
      setState("error");
    }
  }

  if (state === "loading") {
    return <div className="wrap detail-state"><p style={{ color: "#94a3b8" }}>Đang tải bài viết…</p></div>;
  }

  if (state === "error" || !article) {
    return (
      <div className="wrap detail-state">
        <p style={{ color: "#ef4444" }}>Không tìm thấy bài viết.</p>
        <Link to={`/team/${id}/articles`} style={{ color: "#64748b", fontSize: 14 }}>← Danh sách bài viết</Link>
      </div>
    );
  }

  const memberId = article.team_member_id || id;

  return (
    <div className="article-detail-page">
      {/* Cover image */}
      {article.thumbnail ? (
        <img src={article.thumbnail} alt={article.title} className="article-hero-cover" />
      ) : (
        <div className="article-hero-cover-placeholder" />
      )}

      {/* Meta bar */}
      <div className="wrap article-meta-bar">
        <Link to={`/team/${id}/articles`} className="detail-back">
          <ArrowLeft size={15} /> Danh sách bài viết
        </Link>

        {/* Author card */}
        <Link to={`/team/${memberId}`} className="article-author-card" style={{ marginTop: 20 }}>
          <div className="article-author-avatar">
            {article.member_avatar ? (
              <img src={article.member_avatar} alt={article.member_name} />
            ) : (
              (article.member_name || "?").slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <div className="article-author-name">{article.member_name}</div>
            <div className="article-author-title">{article.member_title}</div>
            <div className="article-author-link">Xem profile →</div>
          </div>
        </Link>

        {/* Date */}
        <div className="article-date-meta">
          <Calendar size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 5 }} />
          {new Date(article.created_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* Title */}
        <h1 className="article-title-big">{article.title}</h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="article-excerpt-big">{article.excerpt}</p>
        )}

        {/* Body blocks */}
        <ArticleBlocks content={article.content} />

        {/* Related */}
        {related.length > 0 && (
          <div className="article-related">
            <div className="article-related-title">Bài viết khác từ {article.member_name}</div>
            <div className="article-related-grid">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/team/${id}/articles/${rel.id}`}
                  className="article-related-card"
                >
                  <h4>{rel.title}</h4>
                  {rel.excerpt && <p>{rel.excerpt.slice(0, 80)}…</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
