import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download, LayoutGrid, Terminal } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { TRIAL_PRODUCTS } from "../../constants/data.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const FALLBACK_APPS = TRIAL_PRODUCTS.map((p, idx) => ({
  id: `trial-${idx}`,
  name: p.name,
  description: p.desc,
  specifications: ["Tiện ích kỹ thuật", "Mã nguồn mở", p.perk],
  app_url: "#contact",
  icon: p.icon || Terminal,
}));

export default function FreeApps() {
  const [apps, setApps] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/products`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((body) => {
        const freeApps = (body.data || []).filter((item) => item.product_type === "trial");
        setApps(freeApps.length > 0 ? freeApps : FALLBACK_APPS);
        setState("ready");
      })
      .catch(() => {
        setApps(FALLBACK_APPS);
        setState("ready");
      });
    return () => controller.abort();
  }, []);

  const displayApps = apps.length > 0 ? apps : FALLBACK_APPS;

  return (
    <section className="section free-apps-section" id="free-apps">
      <div className="wrap">
        <div className="free-apps-head">
          <div>
            <div className="kicker">
              <span className="kicker-dot" />
              <span>Tiện ích số &amp; Công cụ phát triển</span>
            </div>
            <Reveal>
              <h2 className="section-title">Công cụ nhỏ. Giá trị dùng mỗi ngày.</h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="section-sub">
                Bộ sưu tập các ứng dụng và tiện ích kỹ thuật được chúng tôi phát triển và cung cấp mở cho cộng đồng kỹ sư và doanh nghiệp.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="free-apps-count">
              <LayoutGrid size={16} />
              <strong>{displayApps.length}</strong>
              <span>tiện ích sẵn sàng</span>
            </div>
          </Reveal>
        </div>

        <div className="free-apps-grid">
          {displayApps.map((app, index) => {
            const Icon = app.icon || Terminal;
            const tags = app.specifications?.length > 0 ? app.specifications.slice(0, 3) : ["Tiện ích", "Mở rộng"];
            return (
              <Reveal key={app.id || app.name} delay={(index % 6) * 60}>
                <article className="free-app-card">
                  <div className="free-app-icon">
                    <Icon size={20} />
                  </div>
                  <div className="free-app-copy">
                    <h3>{app.name}</h3>
                    <p>{app.description || app.desc}</p>
                    <div className="free-app-tags">
                      {tags.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="free-app-footer">
                    <span>
                      <Download size={13} /> Miễn phí trải nghiệm
                    </span>
                    <a
                      href={app.app_url || "#contact"}
                      target={app.app_url?.startsWith("http") ? "_blank" : undefined}
                      rel={app.app_url?.startsWith("http") ? "noreferrer" : undefined}
                      aria-label={`Trải nghiệm tiện ích ${app.name}`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
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
