import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download, LayoutGrid, Sparkles } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { TRIAL_PRODUCTS } from "../../constants/data.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const colors = ["app-cyan", "app-violet", "app-orange", "app-green"];

export default function FreeApps() {
  const [apps, setApps] = useState(TRIAL_PRODUCTS);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/products`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        const freeApps = (body.data || []).filter((item) => item.product_type === "trial");
        if (freeApps.length) setApps(freeApps);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <section className="section free-apps-section" id="free-apps">
      <div className="wrap">
        <div className="free-apps-head">
          <div>
            <Reveal><SectionEyebrow label="Ứng dụng miễn phí" /></Reveal>
            <Reveal delay={50}><h2 className="section-title">Công cụ nhỏ. Giá trị dùng mỗi ngày.</h2></Reveal>
            <Reveal delay={90}><p className="section-sub">Bộ sưu tập ứng dụng tiện ích do chúng tôi phát triển và mở miễn phí cho cộng đồng.</p></Reveal>
          </div>
          <Reveal delay={120}><div className="free-apps-count"><LayoutGrid size={18} /><strong>{apps.length}</strong><span>ứng dụng<br />đang có</span></div></Reveal>
        </div>

        <div className="free-apps-grid">
          {apps.map((app, index) => {
            const Icon = app.icon || Sparkles;
            return (
              <Reveal key={app.id || app.name} delay={(index % 6) * 55}>
                <article className={`free-app-card ${colors[index % colors.length]}`}>
                  <div className="free-app-icon"><Icon size={21} /></div>
                  <div className="free-app-copy">
                    <span>FREE TOOL · 0{index + 1}</span>
                    <h3>{app.name}</h3>
                    <p>{app.description || app.desc}</p>
                  </div>
                  <div className="free-app-footer">
                    <span><Download size={13} /> Miễn phí</span>
                    <a href="#contact" aria-label={`Xem ứng dụng ${app.name}`}><ArrowUpRight size={17} /></a>
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
