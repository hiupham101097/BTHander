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
            <span>01 / KỸ THUẬT PHẦN MỀM &amp; THIẾT KẾ CƠ ĐIỆN TỬ</span>
          </div>

          <Reveal>
            <h1 className="h1">
              Biến ý tưởng kỹ thuật thành sản phẩm thực tế.
            </h1>
          </Reveal>

          <Reveal delay={90}>
            <p className="lead">
              Đội ngũ kỹ thuật chuyên sâu về kiến trúc phần mềm, ứng dụng di động, hệ thống quản lý và bản vẽ chế tạo máy — tập trung vào tính chính xác, hiệu năng và khả năng triển khai thực tế.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">
                Bắt đầu dự án <ArrowUpRight size={17} />
              </a>
              <a className="btn-ghost" href="#projects">
                Xem dự án thực tế <ArrowDownRight size={16} />
              </a>
            </div>
          </Reveal>

          <div className="hero-trust-row">
            <span><CheckCircle2 size={14} /> Mã nguồn &amp; CAD bàn giao đầy đủ</span>
            <span><CheckCircle2 size={14} /> Tiêu chuẩn kỹ thuật cao</span>
            <span><CheckCircle2 size={14} /> Hỗ trợ triển khai &amp; vận hành</span>
          </div>

          <div className="hero-capabilities">
            <span><Code2 size={14} /> Web &amp; Hệ thống</span>
            <span><Smartphone size={14} /> Mobile Apps</span>
            <span><Gamepad2 size={14} /> Game &amp; 3D</span>
            <span><Cpu size={14} /> Chế tạo máy &amp; CAD</span>
          </div>
        </div>

        <Reveal delay={80} className="hero-visual">
          <div className="hero-visual-frame">
            <div className="hero-visual-bar">
              <div className="spec-code">
                <span />
                <span>SPEC // CORE_LAB_V2</span>
              </div>
              <div>COORDINATES: [10.76° N, 106.66° E]</div>
            </div>
            <img
              src="/images/hero-tech-lab.png"
              alt="BThander Tech Lab & Prototyping - Phần mềm và cơ điện tử"
            />
            <div className="hero-visual-label">
              <span>STATUS: PRODUCTION_READY</span>
              <span>BTHANDER PRECISION LAB</span>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
