import React from "react";
import { ChevronRight } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function CTA() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal>
          <div className="cta-panel">
            <h3 className="cta-title">Sẵn sàng đưa AI ra hiện trường của bạn?</h3>
            <p className="cta-sub">Đặt lịch demo trực tiếp với đội ngũ kỹ thuật Aurix — không cam kết dài hạn.</p>
            <div className="hero-actions">
              <button className="btn-primary">Đặt lịch demo <ChevronRight size={16} /></button>
              <button className="btn-ghost">Liên hệ đội ngũ bán hàng</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
