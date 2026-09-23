import React from "react";
import Reveal from "../ui/Reveal.jsx";
import { STATS } from "../../constants/data.js";

export default function Stats() {
  return (
    <section className="wrap stats-strip" id="achievements">
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <Reveal delay={i * 80} key={s.label}>
            <div className="stat-cell">
              <div className="stat-icon"><s.icon size={18} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
