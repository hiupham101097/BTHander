import React, { useState, useRef } from "react";
import { ArrowUpRight, Check, Code2, Layers3, Sparkles } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api.js";
import useApiList from "../../hooks/useApiList.js";

const FALLBACK_PROJECTS = [
  {
    id: "space-blast",
    name: "SPACE BLAST",
    description: "Game hành động không gian thế hệ mới do Brave Trust Hander phát triển với đồ họa tương tác 3D và tối ưu hiệu năng mượt mà trên thiết bị di động.",
    languages: ["Game Mobile", "Unity / C#", "3D Interactive"],
    configuration: { "Loại": "Action Game", "Hiệu năng": "60 FPS Cố định", "Nền tảng": "iOS / Android" },
    price: 0,
    currency: "VND",
    cover_image: "/images/game-development.png",
  },
  {
    id: "bang-bang",
    name: "Bang Bang",
    description: "Game giải trí đối kháng nhịp độ nhanh, trực quan và dễ tiếp cận, kết hợp cơ chế gameplay vật lý sáng tạo.",
    languages: ["Game Mobile", "TypeScript", "WebGL"],
    configuration: { "Loại": "Casual Game", "Chế độ": "Real-time Sync" },
    price: 0,
    currency: "VND",
    cover_image: "/images/mobile-development.png",
  },
  {
    id: "chem-hoa-qua",
    name: "Chém hoa quả",
    description: "Game tương tác cảm ứng trực tiếp lấy cảm hứng từ thao tác chém trái cây, tối ưu chuyển động hạt và hiệu ứng thị giác ấn tượng.",
    languages: ["Mobile App", "React Native", "Canvas Engine"],
    configuration: { "Loại": "Arcade", "Điều khiển": "Cảm ứng đa điểm" },
    price: 0,
    currency: "VND",
    cover_image: "/images/management-website.png",
  },
];

function ProjectCard({ project, index, user, interested, pending, markInterest }) {
  const cardRef = useRef(null);
  const visual = project.cover_image || project.gallery?.[0]?.image_url;
  const projectUrl = `/projects/${project.id}`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Reveal delay={100 + index * 80} className="project-card-cell">
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="core-project-card spotlight-card"
      >
        <div className="card-spotlight-glow" />

        <div className="project-cover-box">
          {visual ? (
            <img
              loading="lazy"
              decoding="async"
              src={visual}
              alt={`Ảnh bìa dự án ${project.name}`}
            />
          ) : (
            <div className="project-cover-empty">
              <Layers3 size={34} />
              <span>Chưa có ảnh bìa</span>
            </div>
          )}
          <div className="project-cover-overlay" />
          <div className="project-tech-badge">
            <Sparkles size={13} />
            <span>CASE STUDY</span>
          </div>
          <Link
            className="project-open-btn"
            to={projectUrl}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Xem chi tiết ${project.name}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="project-card-body">
          <div className="project-card-title-row">
            <h3>{project.name}</h3>
            <span className="project-index-num">{"#" + String(index + 1).padStart(2, "0")}</span>
          </div>

          <div className="project-languages-list">
            <Code2 size={14} />
            <span>{(project.languages || []).join(" • ")}</span>
          </div>

          {project.description && (
            <p className="project-description-text">{project.description}</p>
          )}

          <div className="project-meta-grid">
            <div className="meta-box">
              <small>HẠNG MỤC TRIỂN KHAI</small>
              <strong>{Object.keys(project.configuration || {}).length || 3} cấu hình chuẩn</strong>
            </div>
            <div className="meta-box">
              <small>MÔ HÌNH</small>
              <strong>{project.configuration?.["Loại"] || "BThander Labs"}</strong>
            </div>
          </div>

          <div className="project-actions-row">
            <Link
              className="proj-view-link"
              to={projectUrl}
              onClick={(e) => e.stopPropagation()}
            >
              <span>Khám phá case study</span>
              <ArrowUpRight size={15} />
            </Link>

            {user ? (
              <button
                className="project-interest-btn"
                disabled={pending !== null || interested.includes(project.id)}
                aria-busy={pending === project.id}
                onClick={(e) => {
                  e.stopPropagation();
                  markInterest(project.id);
                }}
              >
                {interested.includes(project.id) ? (
                  <>
                    <Check size={14} /> Đã quan tâm
                  </>
                ) : pending === project.id ? (
                  "Đang lưu…"
                ) : (
                  "Quan tâm"
                )}
              </button>
            ) : (
              <Link
                className="project-interest-btn"
                to="/login"
                onClick={(e) => e.stopPropagation()}
              >
                Quan tâm
              </Link>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  const { data: apiProjects } = useApiList("/api/projects?view=summary");
  const [interested, setInterested] = useState([]);
  const [pending, setPending] = useState(null);
  const [actionError, setActionError] = useState("");
  const { user } = useAuth();

  const filteredApi = (apiProjects || []).filter(
    (project) => !project.name?.toLocaleLowerCase("vi").includes("ứng dụng miễn phí")
  );

  const displayProjects = filteredApi.length > 0 ? filteredApi : FALLBACK_PROJECTS;

  const markInterest = async (id) => {
    if (pending !== null) return;
    setPending(id);
    setActionError("");
    try {
      await apiRequest(`/api/projects/${id}/interest`, { method: "POST" });
      setInterested((items) => [...items, id]);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="section projects-section" id="projects" aria-label="Dự án thực tế">
      <div className="wrap">
        <div className="section-head-center">
          <Reveal>
            <div className="section-eyebrow-box">
              <span className="eyebrow-tag">PORTFOLIO DỰ ÁN</span>
              <span className="eyebrow-id">{"// CASE-STUDIES.02"}</span>
            </div>
            <h2 className="section-title">
              Sản phẩm thật. <span className="shimmer-text">Năng lực nhìn thấy được.</span>
            </h2>
            <p className="section-sub">
              Mỗi dự án được thiết kế bài bản, kiểm chứng thực nghiệm và bàn giao với kiến trúc chuẩn chỉ và phạm vi rõ ràng.
            </p>
          </Reveal>
        </div>

        {actionError && (
          <p className="api-state api-state-error" role="alert">
            {actionError}
          </p>
        )}

        <div className="projects-spacious-grid">
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              user={user}
              interested={interested}
              pending={pending}
              markInterest={markInterest}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
