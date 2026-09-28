import React from "react";
import { ArrowUpRight, Download, LayoutGrid, Sparkles } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

import useApiList from "../../hooks/useApiList.js";
const colors = ["app-cyan", "app-violet", "app-orange", "app-green"];

export default function FreeApps() {
  const { data: products, state, retry } = useApiList("/api/products");
  const apps = products.filter(item => item.product_type === "trial");


  return (
    <section className="section free-apps-section" id="free-apps">
      <div className="wrap">
        <div className="free-apps-head">
          <div>
            <Reveal><h2 className="section-title">Ứng dụng từ BThander.</h2></Reveal>
            <Reveal delay={90}><p className="section-sub">Các công cụ miễn phí được phát triển từ nhu cầu sử dụng thực tế.</p></Reveal>
          </div>
          {apps.length > 0 && <Reveal delay={120}><div className="free-apps-count"><LayoutGrid size={18} /><strong>{apps.length}</strong><span>ứng dụng<br />đang có</span></div></Reveal>}
        </div>

        {state === "loading" && <div className="project-loading"><span /><span /><span /></div>}
        {state === "error" && <p role="alert" className="api-state api-state-error">Chưa thể tải danh sách ứng dụng. <button type="button" className="btn-ghost" onClick={retry}>Thử lại</button></p>}
        {state === "ready" && apps.length === 0 && <div className="free-apps-empty"><Sparkles size={22} /><div><strong>Danh mục đang được cập nhật</strong><p>Ứng dụng mới sẽ xuất hiện tại đây sau khi hoàn tất kiểm thử.</p></div></div>}

        {apps.length > 0 && <div className="free-apps-grid">
          {apps.map((app, index) => {
            const Icon = app.icon || Sparkles;
            return (
              <Reveal key={app.id || app.name} delay={(index % 6) * 55}>
                <article className={`free-app-card ${colors[index % colors.length]}`}>
                  <div className="free-app-cover">{app.image_url ? <img loading="lazy" decoding="async" src={app.image_url} alt={`Ảnh ứng dụng ${app.name}`} /> : <div className="free-app-cover-empty"><Icon size={30} /></div>}</div>
                  <div className="free-app-icon"><Icon size={21} /></div>
                  <div className="free-app-copy">
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
