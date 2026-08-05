import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { PROJECT_CATEGORIES, PROJECTS } from "../../constants/data.js";

export default function Projects() {
  const [projTab, setProjTab] = useState(PROJECT_CATEGORIES[0]);
  const activeProject = PROJECTS[projTab];

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Dự án nổi bật" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Bốn ngành, một hạ tầng AI biên duy nhất.</h2></Reveal>
        <Reveal delay={120}><p className="section-sub">Chọn một lĩnh vực để xem Aurix đã tạo ra thay đổi gì trên thực địa.</p></Reveal>

        <Reveal delay={160}>
          <div className="tab-row">
            {PROJECT_CATEGORIES.map((c) => (
              <button
                key={c}
                className={`tab-btn ${projTab === c ? "active" : ""}`}
                onClick={() => setProjTab(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="proj-showcase">
          <div className="proj-visual" style={{ background: activeProject.grad }}>
            <div className="proj-visual-icon"><activeProject.icon size={36} /></div>
          </div>
          <div className="proj-info-card">
            <div className="proj-name">{activeProject.name}</div>
            <div className="proj-tag">{activeProject.tag}</div>
            <p className="proj-desc">{activeProject.desc}</p>
            <div className="proj-metric"><CheckCircle2 size={16} /> {activeProject.metric}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
