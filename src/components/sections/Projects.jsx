import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Code2, Layers3 } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

function formatPrice(price, currency) {
  if (!price || price === 0) return "Liên hệ báo giá";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency || "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "Hệ thống Quản lý Vận hành & Nền tảng Doanh nghiệp",
    category: "web",
    languages: ["React", "Node.js", "PostgreSQL", "Cloudflare"],
    description: "Kiến trúc nền tảng số hóa quản lý tài nguyên, quy trình dự án và báo cáo tài chính thời gian thực với phân quyền đa cấp.",
    price: 35000000,
    currency: "VND",
    configuration: { m1: "Quản trị", m2: "Báo cáo", m3: "API Gateway" },
    cover_image: "/images/management-website.png",
  },
  {
    id: 2,
    name: "Ứng dụng Di động Đa nền tảng Hiệu năng cao",
    category: "mobile",
    languages: ["Flutter", "Dart", "Firebase", "REST API"],
    description: "Ứng dụng di động tối ưu hóa rendering 60fps, đồng bộ offline-first, hỗ trợ thông báo đẩy và thanh toán trực tuyến bảo mật.",
    price: 28000000,
    currency: "VND",
    configuration: { ios: "iOS Native", android: "Android Native", api: "Backend Service" },
    cover_image: "/images/mobile-development.png",
  },
  {
    id: 3,
    name: "Thiết kế & Bản vẽ Chế tạo Cụm máy Tự động",
    category: "cad",
    languages: ["SolidWorks", "CAD 2D/3D", "Bản vẽ gia công", "Đồ gá"],
    description: "Mô hình hóa 3D chi tiết, tính toán độ bền kết cấu và xuất hồ sơ bản vẽ chế tạo dung sai chính xác phục vụ gia công CNC.",
    price: 42000000,
    currency: "VND",
    configuration: { model3d: "Mô hình 3D", cad2d: "Hồ sơ 2D", bom: "BOM chi tiết" },
    cover_image: "/images/service-machine-cad.png",
  },
  {
    id: 4,
    name: "Mô phỏng 3D & Trải nghiệm Game Tương tác",
    category: "game",
    languages: ["Unity", "C#", "3D Modeling", "Shader Graph"],
    description: "Sản phẩm tương tác 3D đồ họa thời gian thực, mô phỏng vận hành máy móc kỹ thuật và trải nghiệm người dùng sinh động.",
    price: 32000000,
    currency: "VND",
    configuration: { sim: "Vận hành", render: "Shader Pipeline", logic: "Engine Core" },
    cover_image: "/images/game-development.png",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState("loading");
  const [interested, setInterested] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/projects`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải dự án");
        return response.json();
      })
      .then((body) => {
        const fetched = body.data || [];
        const visible = fetched.filter(
          (project) => !project.name?.toLocaleLowerCase("vi").includes("ứng dụng miễn phí")
        );
        setProjects(visible.length > 0 ? visible : FALLBACK_PROJECTS);
        setState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setProjects(FALLBACK_PROJECTS);
          setState("ready");
        }
      });
    return () => controller.abort();
  }, []);

  const markInterest = async (id) => {
    try {
      const response = await fetch(`/api/projects/${id}/interest`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) setInterested((items) => [...items, id]);
    } catch {}
  };

  const displayList = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return (
    <section className="section projects-section" id="projects">
      <div className="wrap">
        <div className="projects-heading">
          <div>
            <div className="kicker">
              <span className="kicker-dot" />
              <span>Dự án &amp; Hồ sơ thực thi</span>
            </div>
            <Reveal>
              <h2 className="section-title">
                Sản phẩm thật.<br />Năng lực nhìn thấy được.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={70}>
            <p className="section-sub">
              Mỗi dự án được nghiên cứu, thiết kế và bàn giao với tiêu chuẩn kỹ thuật cao, hồ sơ mã nguồn hoặc bản vẽ rõ ràng.
            </p>
          </Reveal>
        </div>

        <div className="core-project-grid">
          {displayList.map((project, index) => {
            const visual = project.cover_image || project.gallery?.[0]?.image_url;
            const configCount = Object.keys(project.configuration || {}).length || 3;
            return (
              <Reveal key={project.id} delay={index * 80}>
                <article className="core-project-card">
                  <div className="project-cover">
                    {visual ? (
                      <img
                        src={visual}
                        alt={`Ảnh bìa dự án ${project.name}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="project-cover-empty">
                        <Layers3 size={32} />
                        <span>Chưa có ảnh bìa</span>
                      </div>
                    )}
                    <Link
                      className="project-open"
                      to={`/projects/${project.id}`}
                      aria-label={`Xem chi tiết ${project.name}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-title">
                      <h3>{project.name}</h3>
                    </div>
                    <div className="project-languages">
                      <Code2 size={13} /> {(project.languages || []).join(" • ")}
                    </div>
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}
                    <div className="project-meta-row">
                      <div>
                        <small>QUY MÔ &amp; NGÂN SÁCH</small>
                        <strong>{formatPrice(project.price, project.currency)}</strong>
                      </div>
                      <div>
                        <small>HẠNG MỤC BÀN GIAO</small>
                        <strong>{configCount} cấu phần kỹ thuật</strong>
                      </div>
                    </div>
                    <div className="project-actions">
                      <Link
                        className="proj-detail-link"
                        to={`/projects/${project.id}`}
                      >
                        Xem chi tiết giải pháp <ArrowUpRight size={15} />
                      </Link>
                      {user ? (
                        <button
                          className="project-interest"
                          disabled={interested.includes(project.id)}
                          onClick={() => markInterest(project.id)}
                        >
                          {interested.includes(project.id) ? (
                            <>
                              <Check size={13} /> Đã quan tâm
                            </>
                          ) : (
                            "Quan tâm"
                          )}
                        </button>
                      ) : (
                        <Link className="project-interest" to="/login">
                          Quan tâm
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
