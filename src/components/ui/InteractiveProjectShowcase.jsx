import React, { useState } from "react";
import {
  Smartphone,
  Globe,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ExternalLink,
  Download,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2
} from "lucide-react";

export default function InteractiveProjectShowcase({ project }) {
  if (!project) return null;

  // Determine category type
  const isMobile =
    project.category === "mobile" ||
    (project.languages || []).some((l) =>
      /game|di động|mobile|app|android|ios/i.test(l)
    ) ||
    /game|app|chém hoa quả|space blast|bang bang|mobile/i.test(
      project.name || ""
    );

  const isCad =
    project.category === "cad" ||
    project.category === "mechanical" ||
    (project.languages || []).some((l) =>
      /cad|cơ khí|bản vẽ|chế tạo|thiết kế máy|solidworks|inventor/i.test(l)
    ) ||
    /cad|cơ khí|chế tạo|máy|bản vẽ|đồ gá/i.test(project.name || "");

  const isWeb = !isMobile && !isCad;

  // Prepare screens from gallery or fallback defaults
  const rawGallery = project.gallery || [];
  let screens = [];

  if (rawGallery.length > 0) {
    screens = rawGallery.map((item, idx) => ({
      id: idx,
      label: item.label || `Màn hình ${idx + 1}`,
      image_url: item.image_url,
      desc: item.desc || `Giao diện thực tế chi tiết ${idx + 1} của ${project.name}.`,
    }));
  } else {
    // High-fidelity fallback screens based on project domain
    if (isMobile) {
      screens = [
        {
          id: 0,
          label: "Màn hình chính & Menu",
          image_url: "/images/game-development.png",
          desc: "Giao diện khởi động trực quan, tối ưu trải nghiệm chạm vuốt 60fps trên di động.",
        },
        {
          id: 1,
          label: "Gameplay & Tính năng lõi",
          image_url: "/images/mobile-development.png",
          desc: "Màn hình thao tác chính với luồng phản hồi mượt mà và giao diện tương tác cao.",
        },
        {
          id: 2,
          label: "Bảng điểm & Cấu hình",
          image_url: "/images/hero-tech-lab.png",
          desc: "Hệ thống số liệu, cài đặt âm thanh và đồng bộ tiến trình của người chơi.",
        },
      ];
    } else if (isCad) {
      screens = [
        {
          id: 0,
          label: "Bản vẽ 3D Isometric",
          image_url: "/images/service-machine-cad.png",
          desc: "Mô hình phối cảnh cụm cơ khí 3D, bóc tách không gian và hướng lắp ráp.",
        },
        {
          id: 1,
          label: "Mặt cắt chi tiết 2D",
          image_url: "/images/ai-machine-engineering.png",
          desc: "Bản vẽ kích thước hình học, dung sai lắp ghép và tiêu chuẩn vật liệu chế tạo.",
        },
        {
          id: 2,
          label: "Cụm đồ gá & Lắp ráp",
          image_url: "/images/service-technical-consulting.png",
          desc: "Tài liệu kỹ thuật hoàn thiện sẵn sàng đưa vào xưởng gia công CNC.",
        },
      ];
    } else {
      screens = [
        {
          id: 0,
          label: "Bảng điều khiển (Dashboard)",
          image_url: "/images/management-website.png",
          desc: "Trang tổng quan số liệu, biểu đồ thời gian thực và quản lý tài nguyên.",
        },
        {
          id: 1,
          label: "Quản lý dữ liệu & Báo cáo",
          image_url: "/images/service-freelance-software.png",
          desc: "Bảng dữ liệu phân trang, lọc nâng cao và xuất file tự động.",
        },
        {
          id: 2,
          label: "Cấu hình & Tích hợp API",
          image_url: "/images/hero-tech-lab.png",
          desc: "Khu vực cài đặt tham số vận hành và liên kết hệ thống đa nền tảng.",
        },
      ];
    }
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const activeScreen = screens[activeIndex] || screens[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="section detail-section showcase-interactive-section">
      <div className="wrap">
        {/* Section Header */}
        <div className="showcase-header">
          <div className="showcase-type-badge">
            {isMobile && (
              <>
                <Smartphone size={15} /> ỨNG DỤNG DI ĐỘNG (MOBILE APP)
              </>
            )}
            {isCad && (
              <>
                <PenTool size={15} /> BẢN VẼ KỸ THUẬT &amp; CƠ KHÍ (CAD / 3D)
              </>
            )}
            {isWeb && (
              <>
                <Globe size={15} /> NỀN TẢNG WEB &amp; PHẦN MỀM (WEB SYSTEM)
              </>
            )}
          </div>
          <h2 className="section-title">
            Trải nghiệm màn hình thực tế của {project.name}.
          </h2>
          <p className="section-sub">
            Chọn từng tab màn hình hoặc dùng phím điều hướng để xem chi tiết giao
            diện thực tế được thiết kế và bàn giao.
          </p>
        </div>

        {/* Screen Switcher Tabs */}
        {screens.length > 1 && (
          <div className="showcase-tabs-container">
            <div className="showcase-tabs-row" role="tablist">
              {screens.map((item, idx) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={activeIndex === idx}
                  className={`showcase-tab-btn ${
                    activeIndex === idx ? "active" : ""
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="tab-dot" />
                  <span className="tab-num">0{idx + 1}</span>
                  <span className="tab-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Interactive Stage */}
        <div className="showcase-stage-layout">
          {/* VIEWPORT: Adapted to project type */}
          <div className="showcase-viewport-col">
            {/* 1. MOBILE SMARTPHONE VIEW */}
            {isMobile && (
              <div className="mobile-phone-frame">
                <div className="phone-island">
                  <span className="phone-mic" />
                  <span className="phone-lens" />
                </div>
                <div className="phone-inner-screen">
                  <img
                    src={activeScreen.image_url}
                    alt={activeScreen.label}
                    className="phone-screen-img"
                    onClick={() => setFullscreenOpen(true)}
                  />
                  <div
                    className="screen-zoom-hint"
                    onClick={() => setFullscreenOpen(true)}
                    title="Phóng to xem chi tiết"
                  >
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div className="phone-home-indicator" />
              </div>
            )}

            {/* 2. WEB BROWSER VIEW */}
            {isWeb && (
              <div className="web-browser-frame">
                <div className="web-browser-topbar">
                  <div className="browser-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="browser-url-pill">
                    <span className="url-lock">🔒</span>
                    <span className="url-text">
                      https://bthander.com/project/{project.name ? project.name.toLowerCase().replace(/\s+/g, "-") : project.id}
                    </span>
                  </div>
                  <div
                    className="browser-zoom-btn"
                    onClick={() => setFullscreenOpen(true)}
                    title="Phóng to"
                  >
                    <Maximize2 size={14} />
                  </div>
                </div>
                <div className="web-browser-viewport">
                  <img
                    src={activeScreen.image_url}
                    alt={activeScreen.label}
                    className="browser-viewport-img"
                    onClick={() => setFullscreenOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* 3. CAD / BLUEPRINT VIEW */}
            {isCad && (
              <div className="cad-blueprint-frame">
                <div className="cad-overlay-grid" />
                <div className="cad-header-hud">
                  <div className="cad-hud-badge">
                    <PenTool size={13} /> CAD DRAFTING / SCALE 1:1
                  </div>
                  <div className="cad-hud-coords">X: 240.50 | Y: 180.25 | Z: 0.00</div>
                  <button
                    className="cad-hud-zoom"
                    onClick={() => setFullscreenOpen(true)}
                    title="Phóng to bản vẽ"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
                <div className="cad-viewport">
                  <img
                    src={activeScreen.image_url}
                    alt={activeScreen.label}
                    className="cad-viewport-img"
                    onClick={() => setFullscreenOpen(true)}
                  />
                  <div className="cad-compass">N ▲</div>
                </div>
              </div>
            )}

            {/* Navigation Arrows */}
            {screens.length > 1 && (
              <div className="stage-nav-controls">
                <button
                  className="stage-arrow-btn"
                  onClick={handlePrev}
                  aria-label="Màn hình trước"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="stage-counter">
                  {activeIndex + 1} / {screens.length}
                </span>
                <button
                  className="stage-arrow-btn"
                  onClick={handleNext}
                  aria-label="Màn hình tiếp theo"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* SIDE INFO: Active screen description & action panel */}
          <div className="showcase-info-col">
            <div className="screen-detail-card">
              <div className="screen-index-kicker">
                MÀN HÌNH {activeIndex + 1} CỦA {screens.length}
              </div>
              <h3 className="screen-detail-title">{activeScreen.label}</h3>
              <p className="screen-detail-desc">{activeScreen.desc}</p>

              <div className="screen-specs-list">
                <div className="spec-row">
                  <span>Trạng thái</span>
                  <strong>
                    <CheckCircle2 size={13} className="text-green" /> Đã kiểm thử &amp; Hoàn thiện
                  </strong>
                </div>
                <div className="spec-row">
                  <span>Khả năng đáp ứng</span>
                  <strong>
                    {isMobile ? "Mọi thiết bị iOS & Android" : isCad ? "File chuẩn DXF / STEP / PDF" : "Responsive Web & Desktop"}
                  </strong>
                </div>
                <div className="spec-row">
                  <span>Bàn giao</span>
                  <strong>Mã nguồn &amp; Tài liệu đầy đủ</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="screen-actions-row">
                <button
                  className="btn-primary"
                  onClick={() => setFullscreenOpen(true)}
                >
                  <Eye size={16} /> Xem ảnh kích thước lớn
                </button>
                <a href="#contact" className="btn-ghost">
                  Tư vấn giải pháp tương tự
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FULLSCREEN LIGHTBOX MODAL */}
        {fullscreenOpen && (
          <div
            className="showcase-lightbox-backdrop"
            onClick={() => setFullscreenOpen(false)}
          >
            <div
              className="showcase-lightbox-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setFullscreenOpen(false)}
                aria-label="Đóng"
              >
                <X size={22} />
              </button>
              <div className="lightbox-img-wrapper">
                <img
                  src={activeScreen.image_url}
                  alt={activeScreen.label}
                  className="lightbox-img"
                />
              </div>
              <div className="lightbox-caption">
                <h4>{activeScreen.label}</h4>
                <p>{activeScreen.desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
