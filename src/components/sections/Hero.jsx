import React from "react";
import ResponsiveImage from "../ui/ResponsiveImage.jsx";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  Gamepad2,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="hero-shell">
      <div className="wrap">
        <div className="hero-two-col-grid">
          {/* Left Column: Vision, Value Prop & Actions */}
          <div className="hero-left-column">
            <Reveal>
              <div className="hero-shimmer-pill">
                <span className="shimmer-pill-dot" />
                <span className="shimmer-pill-text">
                  BTHANDER LAB // KỸ THUẬT SỐ &amp; CƠ ĐIỆN TỬ
                </span>
                <Sparkles size={13} className="shimmer-pill-sparkle" />
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="hero-grand-title">
                Biến ý tưởng kỹ thuật thành{" "}
                <span className="shimmer-text">sản phẩm thật.</span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="hero-grand-lead">
                Nghiên cứu kiến trúc, phát triển phần mềm cao cấp, ứng dụng di động đa nền tảng và thiết kế chế tạo máy chính xác — được thực thi bởi đội ngũ kỹ sư tinh gọn.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="hero-cta-group">
                <a className="btn-primary shiny-btn" href="#contact">
                  <span className="btn-shine-sweep" />
                  <span className="btn-inner-text">
                    Bắt đầu dự án <ArrowUpRight size={17} />
                  </span>
                </a>
                <a className="btn-ghost shiny-ghost-btn" href="#projects">
                  Xem dự án <ArrowDownRight size={16} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="hero-trust-strip">
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="trust-icon" />
                  <span>Mã nguồn &amp; CAD bàn giao 100%</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="trust-icon" />
                  <span>Chuẩn công nghiệp</span>
                </div>
                <div className="trust-divider" />
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="trust-icon" />
                  <span>Bảo hành dài hạn</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="hero-capability-row">
                <a href="#capabilities" className="capability-tag">
                  <Code2 size={14} /> <span>Web &amp; Cloud</span>
                </a>
                <a href="#capabilities" className="capability-tag">
                  <Smartphone size={14} /> <span>Mobile Apps</span>
                </a>
                <a href="#capabilities" className="capability-tag">
                  <Gamepad2 size={14} /> <span>Game &amp; 3D</span>
                </a>
                <a href="#capabilities" className="capability-tag">
                  <Cpu size={14} /> <span>Cơ điện tử</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Full-Height Futuristic Cinematic Stage */}
          <div className="hero-right-column">
            <Reveal delay={200}>
              <div className="hero-stage-container">
                <div className="stage-ambient-glow" />
                <div className="hero-showcase-stage">
                  {/* Animate UI Signature Border Beam */}
                  <div className="border-beam" />

                  <ResponsiveImage
                    src="/images/hero-tech-lab.png"
                    loading="eager"
                    fetchPriority="high"
                    className="hero-stage-img"
                    alt="Công nghệ phần mềm, game và kỹ thuật chế tạo máy BThander"
                  />

                  <div className="hero-stage-glass-overlay" />

                  {/* Status bar at bottom */}
                  <div className="stage-status-bar">
                    <div className="stage-status-left">
                      <span className="live-radar-dot" />
                      <span className="stage-label">PRECISION LAB ENVIRONMENT // v2.6</span>
                    </div>
                    <div className="stage-status-right">
                      <span>DEPLOYED &amp; OPERATIONAL</span>
                    </div>
                  </div>

                  {/* Floating Air Telemetry Cards - Properly column-stacked so text never collides */}
                  <div className="floating-telemetry-card card-top-left">
                    <div className="telemetry-icon-box">
                      <Cpu size={16} />
                    </div>
                    <div className="telemetry-content">
                      <span className="telemetry-title">IoT &amp; CAD Prototyping</span>
                      <span className="telemetry-metric">PRECISION: 99.8% // 60 FPS</span>
                    </div>
                  </div>

                  <div className="floating-telemetry-card card-bottom-right">
                    <div className="telemetry-icon-box">
                      <Zap size={16} />
                    </div>
                    <div className="telemetry-content">
                      <span className="telemetry-title">Full-Stack Architecture</span>
                      <span className="telemetry-metric">ENTERPRISE STANDARDS</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </header>
  );
}
