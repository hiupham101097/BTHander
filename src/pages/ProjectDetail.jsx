import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleDot,
  Code2,
  Database,
  Settings2,
  Smartphone,
  Globe,
  Monitor
} from "lucide-react";

const gradients = [
  "linear-gradient(135deg,#7c3aed,#ec4899)",
  "linear-gradient(135deg,#0891b2,#7c3aed)",
  "linear-gradient(135deg,#ea580c,#ec4899)",
];

const statusIcon = {
  done: CheckCircle2,
  current: CircleDot,
  upcoming: Circle,
};

function stringToBlocks(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* legacy text */ }
  return [{ type: "text", content: raw }];
}

export default function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      setState("loading");
      const response = await fetch(`/api/projects/${id}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setProject(body.data);
    } catch (e) {
      setState("error");
    } finally {
      setState("ready");
    }
  }

  if (state === "loading") {
    return <div className="wrap detail-state">Đang tải dự án...</div>;
  }

  if (!project) {
    return (
      <div className="wrap detail-state">
        <h2 className="section-title">Không tìm thấy dự án</h2>
        <p className="section-sub">Dự án này có thể đã bị xoá hoặc đường dẫn không chính xác.</p>
        <Link to="/#projects" className="btn-ghost">Quay lại trang chủ</Link>
      </div>
    );
  }

  const gradient = gradients[Number(project.id) % gradients.length];
  const gallery = project.gallery || [];
  const roadmap = project.roadmap || [];
  const blocks = stringToBlocks(project.full_description);

  const price = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: project.currency || "VND",
    maximumFractionDigits: 0,
  }).format(project.price || 0);

  const isMobile = project.category === "mobile";
  const CategoryIcon = isMobile ? Smartphone : (project.category === "software" ? Monitor : Globe);
  const categoryLabel = isMobile ? "Mobile App" : (project.category === "software" ? "Phần mềm" : "Website");

  return (
    <div>
      {/* Back */}
      <div className="wrap detail-back-wrap">
        <Link to="/#projects" className="detail-back">
          <ArrowLeft size={15} /> Quay lại danh sách dự án
        </Link>
      </div>

      {/* Hero */}
      <header className="detail-hero" style={{ background: gradient }}>
        <div className="wrap detail-hero-inner">
          <div className="detail-hero-icon" style={{ borderRadius: 16 }}>
            <CategoryIcon size={40} />
          </div>

          <span className="detail-category-badge" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: 20 }}>
            {categoryLabel} · {project.languages?.join(", ")}
          </span>

          <h1 className="detail-hero-title">{project.name}</h1>

          <p className="detail-hero-tag">
            {project.detail_tag || project.description || "Giải pháp được xây dựng theo mục tiêu và phạm vi thực tế."}
          </p>
        </div>
      </header>

      {/* Description */}
      <section className="section detail-section">
        <div className="wrap detail-desc-grid">
          <div>
            <div className="eyebrow">Giới thiệu chi tiết</div>
            <div className="proj-blocks">
              {blocks.map((block, idx) => {
                if (block.type === "heading") {
                  return <h3 key={idx} className="proj-block-heading">{block.content}</h3>;
                }
                if (block.type === "image") {
                  return (
                    <div key={idx} className="proj-block-image">
                      <img src={block.url} alt={block.caption || "Hình ảnh"} />
                      {block.caption && <p className="proj-block-image-caption">{block.caption}</p>}
                    </div>
                  );
                }
                return <p key={idx} className="proj-block-text">{block.content}</p>;
              })}
              {blocks.length === 0 && <p className="proj-block-text">Thông tin mô tả cho dự án này đang được cập nhật.</p>}
            </div>
          </div>

          <div className="proj-metric detail-metric" style={{ alignSelf: "start", position: "sticky", top: 100 }}>
            <CheckCircle2 size={16} />
            {project.price === 0 ? "Liên hệ báo giá" : price}
          </div>
        </div>
      </section>

      {/* Gallery Mockups */}
      {gallery.length > 0 && (
        <section className="section detail-section" style={{ background: "#f8fafc", padding: "80px 0" }}>
          <div className="wrap">
            <div className="eyebrow" style={{ textAlign: "center" }}>Hình ảnh sản phẩm</div>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: 60 }}>
              Giao diện thực tế của {project.name}.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
              {gallery.map((item, index) => (
                <div key={index} className="device-mockup-wrapper">
                  {isMobile ? (
                    <div className="device-phone">
                      <img src={item.image_url} alt={item.label} />
                    </div>
                  ) : (
                    <div className="device-browser">
                      <div className="device-browser-header">
                        <div className="device-browser-dot red" />
                        <div className="device-browser-dot yellow" />
                        <div className="device-browser-dot green" />
                      </div>
                      <img src={item.image_url} alt={item.label} />
                    </div>
                  )}
                  {item.label && (
                    <p style={{ textAlign: "center", marginTop: 16, fontSize: 15, color: "#475569", fontWeight: 500, position: "absolute", bottom: 0 }}>
                      {item.label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roadmap */}
      {roadmap.length > 0 && (
        <section className="section detail-section">
          <div className="wrap">
            <div className="eyebrow">Lộ trình phát triển</div>
            <h2 className="section-title">Từ thử nghiệm đến triển khai diện rộng.</h2>

            <div className="timeline">
              {roadmap.map((step, index) => {
                const StatusIcon = statusIcon[step.status] || Circle;
                return (
                  <div key={`${step.phase}-${index}`} className={`timeline-item status-${step.status}`}>
                    <div className="timeline-marker">
                      <StatusIcon size={18} />
                      {index < roadmap.length - 1 && <span className="timeline-line" />}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-visual" style={{ background: gradient }}>
                        <Settings2 size={22} />
                      </div>

                      <div className="timeline-text">
                        <div className="timeline-phase">{step.phase}</div>
                        <div className="timeline-title">{step.title}</div>
                        <p className="timeline-desc">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}