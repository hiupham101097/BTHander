import React from "react";
import Reveal from "../ui/Reveal.jsx";
import { STATS } from "../../constants/data.js";

export default function Stats() {
  return (
    <section className="stats-airy-section" id="achievements" aria-label="Thống kê năng lực">
      <div className="wrap">
        <div className="stats-floating-grid">
          {STATS.map((s, i) => (
            <Reveal delay={i * 80} key={s.label}>
              <div className="stat-floating-card">
                <div className="stat-card-glow" />
                <div className="stat-card-top">
                  <span className="stat-index-badge">{"// 0" + (i + 1)}</span>
                  <div className="stat-icon-wrapper">
                    <s.icon size={20} />
                  </div>
                </div>
                <div className="stat-number-display shimmer-text">{s.value}</div>
                <div className="stat-label-text">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
