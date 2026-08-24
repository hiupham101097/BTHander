import React from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { SALE_PRODUCTS } from "../../constants/data.js";

const serviceVisuals = [
  "/images/service-freelance-software.png",
  "/images/service-machine-cad.png",
  "/images/service-technical-consulting.png",
];

export default function Products() {
  return (
    <section className="section services-section" id="products">
      <div className="wrap">
        <div className="section-heading-row services-heading">
          <div>
            <Reveal><SectionEyebrow label="Dịch vụ chuyên môn" /></Reveal>
            <Reveal delay={60}><h2 className="section-title">Đội ngũ kỹ thuật cho những bài toán cần làm thật.</h2></Reveal>
          </div>
          <Reveal delay={110}><div className="services-side-copy"><p>Từ phần mềm đến thiết kế máy, chúng tôi tham gia với phạm vi rõ ràng và đầu ra có thể triển khai.</p><a href="#contact">Nhận tư vấn dự án <ArrowUpRight size={15} /></a></div></Reveal>
        </div>

        <div className="prod-grid">
          {SALE_PRODUCTS.map((p, i) => (
            <Reveal delay={i * 80} key={p.name}>
              <article className="prod-card">
                <div className="service-visual"><img src={serviceVisuals[i]} alt={`Minh họa ${p.name}`} /><span>0{i + 1}</span><div className="prod-icon"><p.icon size={21} /></div></div>
                <div className="service-card-content">
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <ul className="prod-specs">{p.specs.map((s) => <li key={s}><Check size={13} />{s}</li>)}</ul>
                  <div className="prod-footer"><span className="prod-price">{p.price}</span><a className="prod-link" href="#contact" aria-label={`Trao đổi về ${p.name}`}><ArrowRight size={17} /></a></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
