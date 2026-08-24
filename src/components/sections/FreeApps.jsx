import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download, LayoutGrid, Sparkles } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const colors = ["app-cyan", "app-violet", "app-orange", "app-green"];

export default function FreeApps() {
  const [apps, setApps] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/products`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        const freeApps = (body.data || []).filter((item) => item.product_type === "trial");
        setApps(freeApps);
        setState("ready");
      })
      .catch(() => setState("error"));
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

        {state === "loading" && <div className="project-loading"><span /><span /><span /></div>}
        {state === "error" && <p className="api-state api-state-error">Chưa thể tải danh sách ứng dụng.</p>}
        {state === "ready" && apps.length === 0 && <div className="free-apps-empty"><Sparkles size={22} /><div><strong>Ứng dụng đang được cập nhật</strong><p>Các ứng dụng miễn phí mới sẽ xuất hiện tại đây.</p></div></div>}

        {apps.length > 0 && <div className="free-apps-grid">
          {apps.map((app, index) => {
            const Icon = app.icon || Sparkles;
            return (
              <Reveal key={app.id || app.name} delay={(index % 6) * 55}>
                <article className={`free-app-card ${colors[index % colors.length]}`}>
                  <div className="free-app-cover">{app.image_url ? <img src={app.image_url} alt={`Ảnh ứng dụng ${app.name}`} /> : <div className="free-app-cover-empty"><Icon size={30} /></div>}<span>FREE APP</span></div>
                  <div className="free-app-icon"><Icon size={21} /></div>
                  <div className="free-app-copy">
                    <span>FREE TOOL · 0{index + 1}</span>
                    <h3>{app.name}</h3>
                    <p>{app.description || app.desc}</p>
                    {app.specifications?.length > 0 && <div className="free-app-tags">{app.specifications.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>}
                  </div>
                  <div className="free-app-footer">
                    <span><Download size={13} /> Miễn phí</span>
                    <a href={app.app_url || "#contact"} target={app.app_url ? "_blank" : undefined} rel={app.app_url ? "noreferrer" : undefined} aria-label={`Xem ứng dụng ${app.name}`}><ArrowUpRight size={17} /></a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>}
      </div>
    </section>
  );
}
