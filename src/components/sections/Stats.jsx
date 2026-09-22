import React from "react";
import Reveal from "../ui/Reveal.jsx";
import { STATS } from "../../constants/data.js";

export default function Stats() {
  return (
    <section className="stats-strip" id="achievements" aria-label="Số liệu năng lực">
      <div className="wrap">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <Reveal delay={i * 70} key={s.label}>
              <div className="stat-cell">
                <div className="stat-icon"><s.icon size={18} /></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
