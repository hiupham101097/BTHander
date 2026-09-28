import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleDot,
  Settings2,
  Smartphone,
  Globe,
  Monitor
} from "lucide-react";
import InteractiveProjectShowcase from "../components/ui/InteractiveProjectShowcase.jsx";
import { apiRequest } from "../lib/api.js";

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
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setProject(null);
    apiRequest(`/api/projects/${id}`, { signal: controller.signal })
      .then(body => {
        if (controller.signal.aborted) return;
        setProject(body.data);
        setState("ready");
      })
      .catch(error => {
        if (!controller.signal.aborted) setState(error.status === 404 ? "missing" : "error");
      });
    return () => controller.abort();
  }, [id, attempt]);

  if (state === "error") {
    return <div className="wrap detail-state" role="alert"><h1>Chưa thể tải dự án</h1><p>Vui lòng kiểm tra kết nối và thử lại.</p><button className="btn-primary" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>;
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
      <header className="detail-hero">
        <div className="wrap detail-hero-inner">
          <div className="detail-hero-icon">
            <CategoryIcon size={40} />
          </div>
          <h1 className="detail-hero-title">{project.name}</h1>
          <p className="detail-category-meta">{categoryLabel}{project.languages?.length ? ` / ${project.languages.join(", ")}` : ""}</p>
          <p className="detail-hero-tag">
            {project.detail_tag || project.description || "Giải pháp được xây dựng theo mục tiêu và phạm vi thực tế."}
          </p>
        </div>
      </header>

      {/* Description */}
      <section className="section detail-section">
        <div className="wrap detail-desc-grid">
          <div>
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

          <div className="proj-metric detail-metric">
            <CheckCircle2 size={16} />
            {project.price === 0 ? "Liên hệ báo giá" : price}
          </div>
        </div>
      </section>

      {/* Interactive Project Showcase (Mobile / Web / CAD) */}
      <InteractiveProjectShowcase project={project} />

      {/* Roadmap */}
      {roadmap.length > 0 && (
        <section className="section detail-section">
          <div className="wrap">
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
                      <div className="timeline-visual">
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
