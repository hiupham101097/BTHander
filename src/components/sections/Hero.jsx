import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="hero-shell">
      <Reveal delay={80} className="hero-visual">
        <img src="/images/hero-tech-lab.png" alt="Công nghệ phần mềm, game và kỹ thuật chế tạo máy" />
      </Reveal>
      <div className="wrap hero">
        <div className="hero-copy">
          <Reveal>
            <h1 className="h1">Biến ý tưởng kỹ thuật thành sản phẩm thật.</h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="lead">Phần mềm, game và thiết kế máy được xây dựng bởi một đội ngũ, từ nghiên cứu đến bàn giao.</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">Bắt đầu dự án <ArrowUpRight size={17} /></a>
              <a className="btn-ghost" href="#projects">Xem dự án <ArrowDownRight size={16} /></a>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
