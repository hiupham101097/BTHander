import React from "react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { TEAM } from "../../constants/data.js";

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Đội ngũ" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Hiểu công nghệ, sát nhu cầu triển khai.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            BThander quy tụ kỹ sư phần mềm, thiết kế sản phẩm và kỹ sư cơ khí để giải quyết trọn vẹn các bài toán thực tế.
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
