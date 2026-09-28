import React, { useState } from "react";
import { ArrowUpRight, Check, Code2, Layers3 } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api.js";

import useApiList from "../../hooks/useApiList.js";
function formatPrice(price, currency) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: currency || "VND", maximumFractionDigits: 0 }).format(price);
}

export default function Projects() {
  const { data: projects, state, retry } = useApiList("/api/projects?view=summary");
  const [interested, setInterested] = useState([]);
  const [pending, setPending] = useState(null);
  const [actionError, setActionError] = useState("");
  const { user } = useAuth();
  const visibleProjects = projects.filter((project) => !project.name?.toLocaleLowerCase("vi").includes("ứng dụng miễn phí"));


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
    <section className="section projects-section" id="projects">
      <div className="wrap">
        <div className="projects-heading">
          <Reveal><h2 className="section-title">Sản phẩm thật.<br />Năng lực nhìn thấy được.</h2></Reveal>
          <Reveal delay={70}><p className="section-sub">Mỗi dự án được thiết kế, kiểm chứng và bàn giao với phạm vi rõ ràng.</p></Reveal>
        </div>

        {state === "loading" && <div className="project-loading"><span /><span /><span /></div>}
        {state === "error" && <p role="alert" className="api-state api-state-error">Chưa thể tải dự án. Vui lòng thử lại sau. <button type="button" className="btn-ghost" onClick={retry}>Thử lại</button></p>}
        {state === "ready" && visibleProjects.length === 0 && <p className="api-state">Dự án đang được cập nhật.</p>}

        {actionError && <p className="api-state api-state-error" role="alert">{actionError}</p>}
        <div className="core-project-grid">
          {visibleProjects.map((project, index) => {
            const visual = project.cover_image || project.gallery?.[0]?.image_url;
            return (
              <Reveal key={project.id} delay={100 + index * 70}>
                <article className="core-project-card">
                  <div className="project-cover">
                    {visual ? <img loading="lazy" decoding="async" src={visual} alt={`Ảnh bìa dự án ${project.name}`} /> : <div className="project-cover-empty"><Layers3 size={34} /><span>Chưa có ảnh bìa</span></div>}
                    <div className="project-cover-overlay" />
                    <Link className="project-open" to={`/projects/${project.id}`} onClick={(event) => event.stopPropagation()} aria-label={`Xem ${project.name}`}><ArrowUpRight size={20} /></Link>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-title"><div><h3>{project.name}</h3></div><Layers3 size={22} /></div>
                    <div className="project-languages"><Code2 size={14} /> {(project.languages || []).join(", ")}</div>
                    {project.description && <p className="project-description">{project.description}</p>}
                    <div className="project-meta-row">
                      <div><small>NGÂN SÁCH</small><strong>{formatPrice(project.price, project.currency)}</strong></div>
                      <div><small>HẠNG MỤC</small><strong>{Object.keys(project.configuration || {}).length} cấu hình</strong></div>
                    </div>
                    <div className="project-actions">
                      <Link className="proj-detail-link" to={`/projects/${project.id}`} onClick={(event) => event.stopPropagation()}>Xem case study <ArrowUpRight size={15} /></Link>
                      {user ? <button className="project-interest" disabled={pending !== null || interested.includes(project.id)} aria-busy={pending === project.id} onClick={(event) => { event.stopPropagation(); markInterest(project.id); }}>{interested.includes(project.id) ? <><Check size={14} /> Đã quan tâm</> : pending === project.id ? "Đang lưu…" : "Quan tâm"}</button> : <Link className="project-interest" to="/login" onClick={(event) => event.stopPropagation()}>Quan tâm</Link>}
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
