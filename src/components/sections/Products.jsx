import React, { useRef } from "react";
import ResponsiveImage from "../ui/ResponsiveImage.jsx";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { SALE_PRODUCTS } from "../../constants/data.js";

const serviceVisuals = [
  "/images/service-freelance-software.png",
  "/images/service-machine-cad.png",
  "/images/service-technical-consulting.png",
];

function ServiceCard({ p, i }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Reveal delay={i * 90} key={p.name} className="service-card-cell">
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="prod-card spotlight-card"
      >
        <div className="card-spotlight-glow" />

        <div className="service-visual-box">
          <ResponsiveImage src={serviceVisuals[i]} alt={`Minh họa ${p.name}`} />
          <div className="service-visual-overlay" />
          <div className="prod-icon-box">
            <p.icon size={22} />
          </div>
          <span className="service-index-badge">{"SV.0" + (i + 1)}</span>
        </div>

        <div className="service-card-content">
          <h3 className="prod-name">{p.name}</h3>
          <p className="prod-desc">{p.desc}</p>

          <div className="prod-specs-title">TIÊU CHUẨN BÀN GIAO:</div>
          <ul className="prod-specs">
            {p.specs.map((s) => (
              <li key={s}>
                <span className="check-box">
                  <Check size={13} />
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="prod-footer">
            <div className="prod-price-box">
              <small>CHI PHÍ ƯỚC TÍNH</small>
              <span className="prod-price">{p.price}</span>
            </div>
            <a className="prod-link" href="#contact" aria-label={`Trao đổi về ${p.name}`}>
              <span>Bắt đầu 123 </span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Products() {
  return (
    <section className="section services-section" id="products" aria-label="Dịch vụ kỹ thuật">
      <div className="wrap">
        <div className="services-heading-spacious">
          <Reveal>
            <div className="section-eyebrow-box">
              <span className="eyebrow-tag">DỊCH VỤ CHUYÊN SÂU</span>
              <span className="eyebrow-id">{"// SERVICES.04"}</span>
            </div>
            <h2 className="section-title">
              Đội ngũ kỹ thuật cho những <span className="shimmer-text">bài toán cần làm thật.</span>
            </h2>
          </Reveal>
          <Reveal delay={70}>
            <div className="services-side-copy">
              <p>
                Từ phần mềm ứng dụng đến thiết kế cơ khí chính xác, chúng tôi tham gia với phạm vi rành mạch, bảo mật và kết quả thực thi được ngay.
              </p>
              <a href="#contact" className="services-cta-link">
                <span>Nhận phân tích &amp; báo giá</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="services-spacious-grid">
          {SALE_PRODUCTS.map((p, i) => (
            <ServiceCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
