import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { TRIAL_PRODUCTS, SALE_PRODUCTS } from "../../constants/data.js";

export default function Products() {
  const [prodTab, setProdTab] = useState("trial");

  return (
    <section className="section" id="products">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Sản phẩm" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Dùng thử trước, triển khai thật sau.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            Trải nghiệm công nghệ BThander miễn phí, hoặc trang bị phần cứng và dịch vụ đám mây cho hệ thống của bạn.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="tab-row">
            <button className={`tab-btn ${prodTab === "trial" ? "active" : ""}`} onClick={() => setProdTab("trial")}>
              Trải nghiệm miễn phí
            </button>
            <button className={`tab-btn ${prodTab === "buy" ? "active" : ""}`} onClick={() => setProdTab("buy")}>
              Sản phẩm bán
            </button>
          </div>
        </Reveal>

        {prodTab === "trial" ? (
          <div className="prod-grid">
            {TRIAL_PRODUCTS.map((p, i) => (
              <Reveal delay={i * 80} key={p.name}>
                <div className="prod-card">
                  <div className="prod-icon" style={{ background: "var(--g-cyan-violet)" }}>
                    <p.icon size={20} />
                  </div>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <div className="prod-footer">
                    <span className="prod-perk">{p.perk}</span>
                    <button className="prod-link">Dùng thử <ArrowUpRight size={14} /></button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="prod-grid">
            {SALE_PRODUCTS.map((p, i) => (
              <Reveal delay={i * 80} key={p.name}>
                <div className="prod-card">
                  <div className="prod-icon" style={{ background: "var(--g-amber-pink)" }}>
                    <p.icon size={20} />
                  </div>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <ul className="prod-specs">
                    {p.specs.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                  <div className="prod-footer">
                    <span className="prod-price">{p.price}</span>
                    <button className="prod-link">Mua ngay <ArrowUpRight size={14} /></button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
