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
        <Reveal><SectionEyebrow label="Dịch vụ" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Một đội ngũ cho sản phẩm số và bài toán kỹ thuật.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            Chúng tôi nhận dự án theo từng giai đoạn — từ thiết kế, phát triển đến bàn giao và đồng hành vận hành.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="tab-row">
            <button className={`tab-btn ${prodTab === "trial" ? "active" : ""}`} onClick={() => setProdTab("trial")}>
              Sản phẩm số
            </button>
            <button className={`tab-btn ${prodTab === "buy" ? "active" : ""}`} onClick={() => setProdTab("buy")}>
              Kỹ thuật & freelance
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
                    <a className="prod-link" href="#contact">Trao đổi <ArrowUpRight size={14} /></a>
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
                    <a className="prod-link" href="#contact">Nhận báo giá <ArrowUpRight size={14} /></a>
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
