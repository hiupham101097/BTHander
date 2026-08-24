import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { TRIAL_PRODUCTS, SALE_PRODUCTS } from "../../constants/data.js";

const serviceVisuals = ["/images/game-development.png", "/images/hero-tech-lab.png", "/images/ai-machine-engineering.png"];

export default function Products() {
  const [prodTab, setProdTab] = useState("trial");
  const products = prodTab === "trial" ? TRIAL_PRODUCTS : SALE_PRODUCTS;

  return (
    <section className="section services-section" id="products">
      <div className="wrap">
        <div className="section-heading-row services-heading">
          <div>
            <Reveal><SectionEyebrow label="Dịch vụ" /></Reveal>
            <Reveal delay={60}><h2 className="section-title">Từ chiến lược đến sản phẩm hoàn chỉnh.</h2></Reveal>
          </div>
          <Reveal delay={110}>
            <div className="services-side-copy"><p>Chọn đúng năng lực cho giai đoạn hiện tại của bạn. Chúng tôi có thể tham gia từ ý tưởng đầu tiên hoặc tăng tốc một sản phẩm đang phát triển.</p><a href="#contact">Nhận tư vấn dự án <ArrowUpRight size={15} /></a></div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="service-switch" role="tablist" aria-label="Nhóm dịch vụ">
            <button role="tab" aria-selected={prodTab === "trial"} className={prodTab === "trial" ? "active" : ""} onClick={() => setProdTab("trial")}><span>01</span>Sản phẩm số</button>
            <button role="tab" aria-selected={prodTab === "buy"} className={prodTab === "buy" ? "active" : ""} onClick={() => setProdTab("buy")}><span>02</span>Kỹ thuật & freelance</button>
          </div>
        </Reveal>

        <div className="prod-grid" key={prodTab}>
          {products.map((p, i) => (
            <Reveal delay={i * 80} key={p.name}>
              <article className="prod-card">
                <div className="service-visual">
                  <img src={serviceVisuals[i]} alt="" />
                  <span>0{i + 1}</span>
                  <div className="prod-icon"><p.icon size={21} /></div>
                </div>
                <div className="service-card-content">
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  {p.specs ? <ul className="prod-specs">{p.specs.map((s) => <li key={s}><Check size={13} />{s}</li>)}</ul> : <div className="service-perk"><Check size={14} />{p.perk}</div>}
                  <div className="prod-footer">
                    <span className={p.price ? "prod-price" : "prod-kicker"}>{p.price || "BẮT ĐẦU TỪ Ý TƯỞNG"}</span>
                    <a className="prod-link" href="#contact" aria-label={`Trao đổi về ${p.name}`}><ArrowRight size={17} /></a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
