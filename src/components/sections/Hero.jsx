import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  Gamepad2,
  Smartphone,
} from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="hero-shell">
      <div className="wrap hero">
        <div className="hero-copy">
          <div className="kicker">
            <span className="kicker-dot" />
            <span>Phần mềm &amp; Kỹ thuật chế tạo</span>
          </div>

          <Reveal>
            <h1 className="h1">
              Biến ý tưởng kỹ thuật thành <span className="accent">sản phẩm thật.</span>
            </h1>
          </Reveal>

          <Reveal delay={90}>
            <p className="lead">
              Phần mềm, ứng dụng di động và thiết kế chế tạo máy được xây dựng bởi một đội ngũ tinh gọn, từ nghiên cứu đến bàn giao.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">
                Bắt đầu dự án <ArrowUpRight size={17} />
              </a>
              <a className="btn-ghost" href="#projects">
                Xem dự án <ArrowDownRight size={16} />
              </a>
            </div>
          </Reveal>

          <div className="hero-trust-row">
            <span><CheckCircle2 size={14} /> Mã nguồn bàn giao đầy đủ</span>
            <span><CheckCircle2 size={14} /> Tiêu chuẩn kỹ thuật cao</span>
            <span><CheckCircle2 size={14} /> Hỗ trợ dài hạn</span>
          </div>

          <div className="hero-capabilities">
            <span><Code2 size={15} /> Web &amp; Hệ thống</span>
            <span><Smartphone size={15} /> Mobile Apps</span>
            <span><Gamepad2 size={15} /> Game &amp; 3D</span>
            <span><Cpu size={15} /> Chế tạo máy &amp; IoT</span>
          </div>
        </div>

        <Reveal delay={80} className="hero-visual">
          <img
            src="/images/hero-tech-lab.png"
            alt="Công nghệ phần mềm, game và kỹ thuật chế tạo máy"
          />
          <div className="hero-scanline" />
          <div className="hero-energy-core">
            <i /><i /><i />
          </div>
          <div className="data-stream data-stream-a">
            <b /><b /><b />
          </div>
          <div className="data-stream data-stream-b">
            <b /><b /><b />
          </div>
          <div className="hero-visual-label">
            <span />
            TECH LAB &amp; PROTOTYPING
          </div>
        </Reveal>
      </div>
    </header>
  );
}
