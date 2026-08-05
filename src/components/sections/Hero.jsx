import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="wrap hero">
      <Reveal>
        <div className="kicker"><Sparkles size={14} /> Công nghệ, thiết kế và chế tạo</div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="h1">
          Biến ý tưởng thành sản phẩm số{ " " }
          <span className="accent">và giải pháp kỹ thuật thực tế.</span>
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="lead">
          Brave Trust Hander triển ứng dụng di động, web app, landing page, dự án freelance và thiết kế bản vẽ chế tạo máy — từ ý tưởng ban đầu đến sản phẩm sẵn sàng vận hành.
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div className="hero-actions">
          <a className="btn-primary" href="#contact">Nhận tư vấn <ChevronRight size={16} /></a>
          <a className="btn-ghost" href="#projects">Xem dự án</a>
        </div>
      </Reveal>
      <Reveal delay={320} className="hero-visual">
        <div className="orbit orbit-1"><span className="orbit-node" /></div>
        <div className="orbit orbit-2"><span className="orbit-node" /></div>
        <div className="hero-visual-label">Digital products · Engineering design</div>
      </Reveal>
    </header>
  );
}
