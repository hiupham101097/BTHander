import React from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { SALE_PRODUCTS } from "../../constants/data.js";

const serviceVisuals = [
  "/images/service-freelance-software.png",
  "/images/service-machine-cad.png",
  "/images/service-technical-consulting.png",
];

const serviceCodes = ["01 / DEV_ENG", "02 / CAD_MECH", "03 / SYS_ARCH"];

export default function Products() {
  return (
    <section className="section services-section" id="products">
      <div className="wrap">
        <div className="services-heading">
          <div>
            <div className="kicker">
              <span className="kicker-dot" />
              <span>Phương thức Hợp tác Kỹ thuật</span>
            </div>
            <Reveal>
              <h2 className="section-title">Đội ngũ kỹ thuật cho những bài toán cần làm thật.</h2>
            </Reveal>
          </div>
          <Reveal delay={70}>
            <div className="services-side-copy">
              <p>
                Từ phần mềm ứng dụng đến thiết kế cơ khí chế tạo, chúng tôi tham gia với phạm vi xác định, tiêu chuẩn kỹ thuật minh bạch và bàn giao đầy đủ.
              </p>
              <a href="#contact">
                Nhận tư vấn giải pháp <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="prod-grid">
          {SALE_PRODUCTS.map((p, i) => (
            <Reveal delay={i * 80} key={p.name}>
              <article className="prod-card">
                <div className="service-visual">
                  <img src={serviceVisuals[i]} alt={`Minh họa ${p.name}`} loading="lazy" />
                  <div className="prod-icon">
                    <p.icon size={18} />
                  </div>
                </div>
                <div className="service-card-content">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)", marginBottom: "4px", display: "block" }}>
                    {serviceCodes[i]}
                  </span>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <ul className="prod-specs">
                    {p.specs.map((s) => (
                      <li key={s}>
                        <Check size={13} /> {s}
                      </li>
                    ))}
                  </ul>
                  <div className="prod-footer">
                    <span className="prod-price">{p.price}</span>
                    <a className="prod-link" href="#contact" aria-label={`Trao đổi về ${p.name}`}>
                      <ArrowRight size={16} />
                    </a>
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
