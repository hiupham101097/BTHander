import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Code2, Layers3 } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const fallbackVisuals = ["/images/hero-tech-lab.png", "/images/game-development.png", "/images/ai-machine-engineering.png"];

function formatPrice(price, currency) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: currency || "VND", maximumFractionDigits: 0 }).format(price);
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState("loading");
  const [interested, setInterested] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/projects`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Không thể tải dự án"); return response.json(); })
      .then((body) => { setProjects(body.data || []); setState("ready"); })
      .catch((error) => { if (error.name !== "AbortError") setState("error"); });
    return () => controller.abort();
  }, []);

  const markInterest = async (id) => {
    const response = await fetch(`/api/projects/${id}/interest`, { method: "POST", credentials: "include" });
    if (response.ok) setInterested((items) => [...items, id]);
  };

  return (
    <section className="section projects-section" id="projects">
      <div className="wrap">
        <div className="section-heading-row">
          <div>
            <Reveal><SectionEyebrow label="Dự án nổi bật" /></Reveal>
            <Reveal delay={60}><h2 className="section-title">Sản phẩm thật. Giá trị có thể đo lường.</h2></Reveal>
          </div>
          <Reveal delay={100}><p className="section-sub">Mỗi dự án là một bài toán riêng — được thiết kế, kiểm chứng và bàn giao với tiêu chuẩn rõ ràng.</p></Reveal>
        </div>

        {state === "loading" && <div className="project-loading"><span /><span /><span /></div>}
        {state === "error" && <p className="api-state api-state-error">Chưa thể tải dự án. Vui lòng thử lại sau.</p>}
        {state === "ready" && projects.length === 0 && <p className="api-state">Dự án đang được cập nhật.</p>}

        <div className="core-project-grid">
          {projects.map((project, index) => {
            const visual = project.gallery?.[0]?.image_url || fallbackVisuals[index % fallbackVisuals.length];
            return (
              <Reveal key={project.id} delay={100 + index * 70}>
                <article className="core-project-card core-project-card-link" role="link" tabIndex={0} onClick={() => navigate(`/projects/${project.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/projects/${project.id}`); }}>
                  <div className="project-cover">
                    <img src={visual} alt="" />
                    <div className="project-cover-overlay" />
                    <span className="project-number">0{index + 1}</span>
                    <span className="project-status"><i /> LIVE PROJECT</span>
                    <Link className="project-open" to={`/projects/${project.id}`} onClick={(event) => event.stopPropagation()} aria-label={`Xem ${project.name}`}><ArrowUpRight size={20} /></Link>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-title"><div><span>CASE STUDY</span><h3>{project.name}</h3></div><Layers3 size={22} /></div>
                    <div className="project-languages"><Code2 size={14} /> {(project.languages || []).join(" · ")}</div>
                    {project.description && <p className="project-description">{project.description}</p>}
                    <div className="project-meta-row">
                      <div><small>NGÂN SÁCH</small><strong>{formatPrice(project.price, project.currency)}</strong></div>
                      <div><small>HẠNG MỤC</small><strong>{Object.keys(project.configuration || {}).length} cấu hình</strong></div>
                    </div>
                    <div className="project-actions">
                      <Link className="proj-detail-link" to={`/projects/${project.id}`} onClick={(event) => event.stopPropagation()}>Xem case study <ArrowUpRight size={15} /></Link>
                      {user ? <button className="project-interest" disabled={interested.includes(project.id)} onClick={(event) => { event.stopPropagation(); markInterest(project.id); }}>{interested.includes(project.id) ? <><Check size={14} /> Đã quan tâm</> : "Quan tâm"}</button> : <Link className="project-interest" to="/login" onClick={(event) => event.stopPropagation()}>Quan tâm</Link>}
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
