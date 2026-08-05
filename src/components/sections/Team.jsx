import React from "react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { TEAM } from "../../constants/data.js";

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Đội ngũ" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Kỹ sư trước, người kể chuyện sau.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            Đội ngũ sáng lập từng vận hành dây chuyền sản xuất và hạ tầng mạng trước khi xây BThander.
          </p>
        </Reveal>
        <div className="team-grid">
          {TEAM.map((t, i) => (
            <Reveal delay={i * 80} key={t.name}>
              <div className="team-card">
                <div className="avatar" style={{ background: t.grad }}>{t.init}</div>
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
