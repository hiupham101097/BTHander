import React from "react";
import { ChevronRight, Gamepad2, MonitorSmartphone, Smartphone, Sparkles, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="hero-shell">
      <div className="wrap hero">
        <div className="hero-copy">
          <Reveal><div className="kicker"><Sparkles size={14} /> Mobile · Website · Game · Chế tạo</div></Reveal>
          <Reveal delay={80}>
            <h1 className="h1">Từ ý tưởng táo bạo đến <span className="accent">sản phẩm thật.</span></h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lead">Chúng tôi lập trình Mobile, website, landing page, game và thiết kế máy; đồng thời kết hợp AI như một công cụ hỗ trợ để tăng tốc nghiên cứu, sáng tạo và triển khai.</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">Bắt đầu dự án <ChevronRight size={16} /></a>
              <a className="btn-ghost" href="#projects">Khám phá năng lực</a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="hero-capabilities" aria-label="Lĩnh vực chuyên môn">
              <span><Smartphone size={16} /> Mobile App</span>
              <span><MonitorSmartphone size={16} /> Website</span>
              <span><Gamepad2 size={16} /> Game</span>
              <span><Wrench size={16} /> Machine Design</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={140} className="hero-visual">
          <img src="/images/hero-tech-lab.png" alt="Công nghệ phần mềm, game và kỹ thuật chế tạo máy" />
          <div className="hero-scanline" />
          <div className="hero-energy-core" aria-hidden="true"><i /><i /><i /></div>
          <div className="data-stream data-stream-a" aria-hidden="true"><b /><b /><b /></div>
          <div className="data-stream data-stream-b" aria-hidden="true"><b /><b /></div>
          <div className="hero-visual-label"><span /> BUILDING WHAT'S NEXT</div>
        </Reveal>
      </div>
    </header>
  );
}
