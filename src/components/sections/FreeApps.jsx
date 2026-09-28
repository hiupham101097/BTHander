import React, { useRef } from "react";
import { ArrowUpRight, Download, LayoutGrid, Sparkles, Terminal, Cpu, ShieldCheck } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import useApiList from "../../hooks/useApiList.js";

const DEFAULT_LAB_APPS = [
  {
    name: "CAD Mesh Inspector & Convert",
    desc: "Tiện ích kiểm tra lỗi lưới polygon và tính toán khối lượng vật liệu file STL/STEP phục vụ gia công 3D.",
    specifications: ["Browser WebAssembly", "Độ chính xác cao", "Bảo mật cục bộ"],
    icon: Cpu,
  },
  {
    name: "Network & Web Performance Benchmark",
    desc: "Công cụ đo lường tốc độ phản hồi máy chủ, Core Web Vitals và phát hiện tài nguyên thắt nút cổ chai.",
    specifications: ["Lighthouse Engine", "Phân tích Real-time", "Tối ưu nén"],
    icon: Terminal,
  },
  {
    name: "BThander Security Token Generator",
    desc: "Bộ tạo khóa định danh mật mã học và kiểm tra độ mạnh của chuỗi xác thực API phân tán.",
    specifications: ["Chuẩn SHA-256", "Không lưu dữ liệu", "Mã nguồn mở"],
    icon: ShieldCheck,
  },
];

function AppCard({ app, index }) {
  const cardRef = useRef(null);
  const Icon = app.icon || Sparkles;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Reveal delay={(index % 6) * 70} className="app-card-cell">
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="free-app-card spotlight-card"
      >
        <div className="card-spotlight-glow" />

        <div className="free-app-top-row">
          <div className="free-app-icon-wrapper">
            <Icon size={22} />
          </div>
          <span className="free-app-status-pill">
            <span className="pill-pulse-dot" /> MIỄN PHÍ
          </span>
        </div>

        <div className="free-app-info-body">
          <h3>{app.name}</h3>
          <p>{app.description || app.desc}</p>
          {app.specifications?.length > 0 && (
            <div className="free-app-chip-row">
              {app.specifications.slice(0, 3).map((item) => (
                <span key={item} className="app-spec-chip">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="free-app-bottom-bar">
          <span className="free-app-license-note">
            <Download size={14} /> Trực tuyến / Không tính phí
          </span>
          <a
            href={app.app_url || "#contact"}
            target={app.app_url ? "_blank" : undefined}
            rel={app.app_url ? "noreferrer" : undefined}
            className="free-app-action-link"
            aria-label={`Trải nghiệm ${app.name}`}
          >
            <span>Sử dụng ngay</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function FreeApps() {
  const { data: products } = useApiList("/api/products");
  const apiApps = (products || []).filter((item) => item.product_type === "trial");
  const displayApps = apiApps.length > 0 ? apiApps : DEFAULT_LAB_APPS;

  return (
    <section className="section free-apps-section" id="free-apps" aria-label="Ứng dụng miễn phí">
      <div className="wrap">
        <div className="free-apps-spacious-head">
          <div>
            <Reveal>
              <div className="section-eyebrow-box">
                <span className="eyebrow-tag">CÔNG CỤ TIỆN ÍCH</span>
                <span className="eyebrow-id">{"// UTILITIES.03"}</span>
              </div>
              <h2 className="section-title">
                Ứng dụng &amp; Tiện ích <span className="shimmer-text">từ BThander.</span>
              </h2>
              <p className="section-sub">
                Các giải pháp phần mềm và công cụ thực nghiệm được xây dựng từ nhu cầu tối ưu hóa công việc kỹ thuật hằng ngày.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="free-apps-counter-badge">
              <LayoutGrid size={18} />
              <div>
                <strong>{displayApps.length}</strong>
                <span>TIỆN ÍCH SẴN CÓ</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="free-apps-spacious-grid">
          {displayApps.map((app, index) => (
            <AppCard key={app.id || app.name} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
