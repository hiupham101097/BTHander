import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Database } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

function formatPrice(price, currency) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: currency || "VND", maximumFractionDigits: 0 }).format(price);
}

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
      .then((body) => { setProjects(body.data || []); setState("ready"); })
      .catch((error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, []);
  const markInterest = async (id) => {
    const response = await fetch(`/api/projects/${id}/interest`, { method: "POST", credentials: "include" });
    if (response.ok) setInterested((items) => [...items, id]);
  };

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Dự án nổi bật" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Giải pháp được xây dựng theo mục tiêu của từng khách hàng.</h2></Reveal>
        <Reveal delay={120}><p className="section-sub">Từ sản phẩm số đến bản vẽ kỹ thuật, mỗi dự án đều được triển khai với phạm vi và tiêu chí bàn giao rõ ràng.</p></Reveal>

        {state === "loading" && <p className="api-state">Đang tải dự án...</p>}
        {state === "error" && <p className="api-state api-state-error">Chưa thể tải dự án. Vui lòng thử lại sau.</p>}
        {state === "ready" && projects.length === 0 && <p className="api-state">Dự án đang được cập nhật.</p>}

        <div className="core-project-grid">
          {projects.map((project) => (
            <Reveal key={project.id} delay={160}>
              <article className="core-project-card">
                <div className="core-project-icon"><Database size={24} /></div>
                <h3>{project.name}</h3>
                <div className="project-languages"><Code2 size={15} /> {project.languages.join(" · ")}</div>
                {project.description && <p className="project-description">{project.description}</p>}
                <dl className="project-config">
                  {Object.entries(project.configuration).map(([key, value]) => (
                    <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>
                  ))}
                </dl>
                <div className="project-price"><CheckCircle2 size={16} /> {formatPrice(project.price, project.currency)}</div>
                <Link className="proj-detail-link" to={`/projects/${project.id}`}>Xem chi tiết dự án <ArrowRight size={15} /></Link>
                {user ? <button className="project-interest" disabled={interested.includes(project.id)} onClick={() => markInterest(project.id)}>{interested.includes(project.id) ? "Đã quan tâm" : "Quan tâm dự án"}</button> : <Link className="project-interest" to="/login">Đăng nhập để quan tâm</Link>}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
