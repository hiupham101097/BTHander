import { apiRequest } from "../lib/api.js";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  UserRound,
  Sparkles,
  ChevronRight,
  Share2,
  Check,
  Send,
  BookOpen,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

/* ── Parse blocks (backward compatible + Markdown/plaintext support) ── */
function parseBlocks(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* plain text or markdown */
  }

  const rawString = String(raw).trim();
  const paragraphs = rawString.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  if (paragraphs.length === 0 && rawString) {
    paragraphs.push(rawString);
  }

  return paragraphs.map((p) => {
    if (p.startsWith("### ")) {
      return { type: "heading", level: 3, content: p.replace(/^###\s*/, "") };
    }
    if (p.startsWith("## ")) {
      return { type: "heading", level: 2, content: p.replace(/^##\s*/, "") };
    }
    if (p.startsWith("# ")) {
      return { type: "heading", level: 1, content: p.replace(/^#\s*/, "") };
    }
    if (p.startsWith("> ")) {
      return { type: "quote", content: p.replace(/^>\s*/, "") };
    }
    return { type: "text", content: p };
  });
}

function estimateReadingTime(content) {
  if (!content) return 3;
  const text = typeof content === "string" ? content : JSON.stringify(content);
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 190));
}

/* ── Render editorial blocks ── */
function ArticleBlocks({ content }) {
  const blocks = parseBlocks(content);
  let firstTextRendered = false;

  return (
    <div className="article-body-blocks">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <h2 key={idx} className="article-block-heading">
              {block.content}
            </h2>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={idx} className="article-block-quote">
              <p>{block.content}</p>
            </blockquote>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={idx} className="article-block-image-wrap">
              {block.url && (
                <img src={block.url} alt={block.caption || "Hình minh họa"} className="article-block-image" />
              )}
              {block.caption && (
                <figcaption className="article-block-image-caption">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        /* text paragraph */
        if (!block.content) return null;
        const isFirst = !firstTextRendered;
        firstTextRendered = true;

        return (
          <p
            key={idx}
            className={`article-block-text ${isFirst ? "article-lead-dropcap" : ""}`}
          >
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

/* ============================================================
   TeamArticles – Newspaper Archive / List View
   ============================================================ */
export function TeamArticles() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [member, setMember] = useState(null);
  const [state, setState] = useState("loading");

  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    Promise.all([
      apiRequest(`/api/team/${id}`, { signal: controller.signal }),
      apiRequest(`/api/team/${id}/articles`, { signal: controller.signal }),
    ]).then(([profile, result]) => {
      if (controller.signal.aborted) return;
      setMember(profile.data);
      setArticles(result.data || []);
      setState("ready");
    }).catch(() => {
      if (!controller.signal.aborted) setState("error");
    });
    return () => controller.abort();
  }, [id, attempt]);
  if (state === "error") return <div className="wrap detail-state" role="alert"><p>Chưa thể tải bài viết.</p><button className="btn-primary" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>;

  return (
    <main className="newspaper-archive-page">
      {/* Topmast bar */}
      <div className="newspaper-topbar">
        <div className="wrap newspaper-topbar-inner">
          <Link to={`/team/${id}`} className="newspaper-back-nav">
            <ArrowLeft size={14} /> QUAY LẠI HỒ SƠ THÀNH VIÊN
          </Link>
          <div className="newspaper-masthead-badge">
            <span className="masthead-pulse" />
            <span>BTHANDER ARCHIVE // KHO LƯU TRỮ BÀI BÁO KỸ THUẬT</span>
          </div>
        </div>
      </div>

      <div className="wrap newspaper-content-container">
        {member && (
          <div className="archive-author-banner">
            <div className="archive-author-avatar">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} />
              ) : (
                <UserRound size={28} />
              )}
            </div>
            <div className="archive-author-info">
              <span className="archive-kicker">[ TÁC GIẢ // BTHANDER ENGINEERING ]</span>
              <h2 className="archive-author-name">{member.name}</h2>
              <p className="archive-author-title">{member.title || "Kỹ sư nghiên cứu & phát triển"}</p>
            </div>
            <div className="archive-author-stats">
              <span className="stat-number">{articles.length}</span>
              <span className="stat-label">BÀI ĐÃ XUẤT BẢN</span>
            </div>
          </div>
        )}

        <div className="archive-header-title">
          <div className="newspaper-kicker">[ BAN BIÊN TẬP // CHUYÊN ĐỀ KỸ THUẬT ]</div>
          <h1 className="archive-main-heading">Bài báo & Nghiên cứu chuyên sâu</h1>
          <p className="archive-sub-heading">
            Tổng hợp các bài viết phân tích kiến trúc phần mềm, nghiên cứu AI và góc nhìn kỹ thuật thực chiến.
          </p>
        </div>

        {state === "loading" && (
          <div className="newspaper-loading-state">
            <div className="newspaper-loading-spinner" />
            <p>Đang tải danh mục bài báo…</p>
          </div>
        )}

        <div className="newspaper-archive-grid">
          {articles.map((article) => (
            <Link
              to={`/team/${id}/articles/${article.id}`}
              key={article.id}
              className="newspaper-archive-card"
            >
              {article.thumbnail ? (
                <div className="archive-card-thumb-wrap">
                  <img src={article.thumbnail} alt={article.title} className="archive-card-thumb" />
                </div>
              ) : (
                <div className="archive-card-thumb-empty">
                  <FileText size={32} />
                </div>
              )}

              <div className="archive-card-content">
                <div className="archive-card-meta">
                  <Calendar size={13} />
                  <span>{new Date(article.created_at).toLocaleDateString("vi-VN")}</span>
                  <span className="meta-sep">•</span>
                  <Clock size={13} />
                  <span>{estimateReadingTime(article.content)} phút đọc</span>
                </div>

                <h2 className="archive-card-title">{article.title}</h2>

                {article.excerpt && (
                  <p className="archive-card-excerpt">
                    {article.excerpt.slice(0, 130)}
                    {article.excerpt.length > 130 ? "…" : ""}
                  </p>
                )}

                <div className="archive-card-foot">
                  <span className="archive-card-cta">Đọc bài viết →</span>
                  <BookOpen size={14} className="archive-card-icon" />
                </div>
              </div>
            </Link>
          ))}

          {!articles.length && state === "ready" && (
            <div className="archive-empty-state">
              <FileText size={38} />
              <p>Thành viên này hiện chưa có bài viết xuất bản.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   TeamArticleDetail – Full-Width Newspaper Editorial Article
   ============================================================ */
export function TeamArticleDetail() {
  const { id, articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [state, setState] = useState("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setRelated([]);
    async function loadArticle() {
      try {
        const body = await apiRequest(`/api/articles/${articleId}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (!body.data) throw new Error("Article missing");
        setArticle(body.data);
        setState("ready");
        const memberId = body.data.team_member_id || body.data.author_id || id;
        try {
          const result = await apiRequest(`/api/team/${memberId}/articles`, { signal: controller.signal });
          if (!controller.signal.aborted) setRelated((result.data || []).filter(item => item.id !== Number(articleId) && item.status === "published").slice(0, 4));
        } catch { /* Related content must not hide a successfully loaded article. */ }
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }
    loadArticle();
    return () => controller.abort();
  }, [id, articleId]);


  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  if (state === "loading") {
    return (
      <div className="wrap newspaper-loading-state">
        <div className="newspaper-loading-spinner" />
        <p>Đang tải ấn phẩm kỹ thuật…</p>
      </div>
    );
  }

  if (state === "error" || !article) {
    return (
      <div className="wrap newspaper-error-state">
        <h2>Không tìm thấy bài báo</h2>
        <p>Bài viết này có thể đã được chuyển lưu trữ hoặc liên kết không hợp lệ.</p>
        <Link to={`/team/${id}/articles`} className="newspaper-btn-back">
          <ArrowLeft size={14} /> Danh sách bài viết
        </Link>
      </div>
    );
  }

  const memberId = article.team_member_id || article.author_id || id;
  const readMins = estimateReadingTime(article.content);

  return (
    <article className="newspaper-article-page">
      {/* Topmast Navigation Bar */}
      <div className="newspaper-topbar">
        <div className="wrap newspaper-topbar-inner">
          <Link to={`/team/${id}/articles`} className="newspaper-back-nav">
            <ArrowLeft size={14} /> TẤT CẢ BÀI BÁO & BÌNH LUẬN KỸ THUẬT
          </Link>
          <div className="newspaper-masthead-badge">
            <span className="masthead-pulse" />
            <span>BTHANDER DISPATCH // SỐ PHÁT HÀNH ĐẶC BIỆT</span>
          </div>
        </div>
      </div>

      <div className="wrap newspaper-content-container">
        {/* Newspaper Editorial Header */}
        <header className="newspaper-masthead-header">
          <div className="newspaper-kicker-row">
            <span className="newspaper-kicker">[ CHUYÊN MỤC: CÔNG NGHỆ & KỶ NGUYÊN AI ]</span>
            <span className="newspaper-edition-label">BÁO CÁO KỸ THUẬT ĐỘC QUYỀN</span>
          </div>

          <h1 className="newspaper-headline">{article.title}</h1>

          {article.excerpt && (
            <p className="newspaper-sapo">{article.excerpt}</p>
          )}

          {/* Newspaper Byline Strip - Spans Full Width */}
          <div className="newspaper-byline-strip">
            <div className="newspaper-author-cell">
              <Link to={`/team/${memberId}`} className="newspaper-author-link">
                <div className="newspaper-author-avatar">
                  {article.member_avatar ? (
                    <img src={article.member_avatar} alt={article.member_name} />
                  ) : (
                    (article.member_name || "?").slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="newspaper-author-text">
                  <div className="byline-label">TÁC GIẢ BÀI BÁO</div>
                  <div className="byline-name">{article.member_name}</div>
                  <div className="byline-role">{article.member_title || "Kỹ sư nghiên cứu"}</div>
                </div>
              </Link>
            </div>

            <div className="newspaper-meta-cell">
              <div className="newspaper-meta-item">
                <Calendar size={14} />
                <span>
                  {new Date(article.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="newspaper-meta-dot">•</div>
              <div className="newspaper-meta-item">
                <Clock size={14} />
                <span>{readMins} phút đọc</span>
              </div>
              <div className="newspaper-meta-dot">•</div>
              <button
                type="button"
                onClick={handleShare}
                className="newspaper-share-btn"
                title="Sao chép đường dẫn bài báo"
              >
                {copied ? <Check size={13} className="text-neon" /> : <Share2 size={13} />}
                <span>{copied ? "ĐÃ SAO CHÉP LINK" : "CHIA SẺ"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Newspaper Hero Cover Image - Spans Full Width */}
        {article.thumbnail ? (
          <figure className="newspaper-cover-figure">
            <div className="newspaper-cover-frame">
              <img src={article.thumbnail} alt={article.title} className="newspaper-cover-img" />
            </div>
            <figcaption className="newspaper-cover-caption">
              <span className="caption-text">Hình ảnh minh họa: Hạ tầng mạng nơ-ron và giải thuật điện toán đám mây.</span>
              <span className="caption-credit">Nguồn: Ban Kỹ Thuật BThander</span>
            </figcaption>
          </figure>
        ) : null}

        {/* 2-Column Newspaper Layout: Expansive Story + Editorial Desk Sidebar */}
        <div className="newspaper-grid-layout">
          {/* Main Story Column */}
          <main className="newspaper-main-column">
            <ArticleBlocks content={article.content} />

            {/* Editorial Sign-off Box */}
            <div className="newspaper-signoff-card">
              <div className="signoff-top">
                <Sparkles size={16} />
                <span>BTHANDER RESEARCH & EDITORIAL DESK</span>
              </div>
              <p>
                Bài viết phản ánh quan điểm nghiên cứu và ứng dụng thực tiễn của đội ngũ kỹ sư tại <strong>BThander</strong>. Mọi trích dẫn hoặc trao đổi học thuật, vui lòng ghi rõ nguồn phát hành.
              </p>
            </div>
          </main>

          {/* Sticky Editorial Sidebar */}
          <aside className="newspaper-sidebar-column">
            <div className="newspaper-sidebar-sticky">
              {/* Author Dossier Box */}
              <div className="newspaper-dossier-box">
                <div className="dossier-header-bar">
                  <span>HỒ SƠ TÁC GIẢ</span>
                </div>
                <div className="dossier-content">
                  <div className="dossier-avatar-wrap">
                    {article.member_avatar ? (
                      <img src={article.member_avatar} alt={article.member_name} />
                    ) : (
                      (article.member_name || "?").slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <h3 className="dossier-author-name">{article.member_name}</h3>
                  <p className="dossier-author-title">{article.member_title || "Kỹ sư nghiên cứu"}</p>
                  <p className="dossier-author-bio">
                    Chịu trách nhiệm nghiên cứu kiến trúc hệ thống và tích hợp giải pháp phần mềm chuyên sâu tại BThander.
                  </p>
                  <Link to={`/team/${memberId}`} className="dossier-profile-link">
                    Xem toàn bộ hồ sơ & dự án <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="newspaper-cta-box">
                <div className="cta-box-tag">{"// TƯ VẤN KỸ THUẬT"}</div>
                <h4 className="cta-box-title">Cần giải pháp kỹ thuật chuyên sâu?</h4>
                <p className="cta-box-desc">
                  Trao đổi trực tiếp cùng đội ngũ kỹ sư của chúng tôi về bài toán phần mềm hoặc chuyển đổi công nghệ.
                </p>
                <a href="/#contact" className="newspaper-cta-btn">
                  <Send size={13} /> Gửi yêu cầu trao đổi →
                </a>
              </div>

              {/* Related mini list in sidebar */}
              {related.length > 0 && (
                <div className="newspaper-sidebar-related">
                  <div className="sidebar-related-head">CÙNG CHUYÊN ĐỀ</div>
                  <div className="sidebar-related-items">
                    {related.slice(0, 3).map((rel) => (
                      <Link
                        key={rel.id}
                        to={`/team/${id}/articles/${rel.id}`}
                        className="sidebar-rel-card"
                      >
                        <div className="sidebar-rel-title">{rel.title}</div>
                        <div className="sidebar-rel-date">
                          {new Date(rel.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Bottom Full-Width Section: Other Articles from Newsroom */}
        {related.length > 0 && (
          <section className="newspaper-bottom-section">
            <div className="newspaper-bottom-heading">
              <div className="newspaper-kicker">[ BAN BIÊN TẬP // ĐỀ XUẤT ĐỌC ]</div>
              <h2 className="newspaper-bottom-title">Các bài viết tiêu biểu khác</h2>
            </div>
            <div className="newspaper-bottom-cards">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/team/${id}/articles/${rel.id}`}
                  className="newspaper-card-item"
                >
                  {rel.thumbnail ? (
                    <div className="newspaper-card-thumb-wrap">
                      <img src={rel.thumbnail} alt={rel.title} className="newspaper-card-thumb" />
                    </div>
                  ) : (
                    <div className="newspaper-card-thumb-empty">
                      <FileText size={24} />
                    </div>
                  )}
                  <div className="newspaper-card-info">
                    <span className="newspaper-card-date">
                      {new Date(rel.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <h3 className="newspaper-card-title">{rel.title}</h3>
                    {rel.excerpt && (
                      <p className="newspaper-card-excerpt">
                        {rel.excerpt.slice(0, 90)}{rel.excerpt.length > 90 ? "…" : ""}
                      </p>
                    )}
                    <span className="newspaper-card-read">Đọc bài viết →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
