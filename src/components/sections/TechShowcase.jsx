import React, { useRef } from "react";
import ResponsiveImage from "../ui/ResponsiveImage.jsx";
import { ArrowUpRight, Gamepad2, MonitorSmartphone, Smartphone, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const showcase = [
  {
    icon: Smartphone,
    tag: "MOBILE APPS",
    modId: "01",
    title: "Ứng dụng Di động Đa nền tảng",
    description: "Lập trình ứng dụng iOS, Android và React Native / Flutter với trải nghiệm mượt mà, tối ưu hiệu năng 60fps và kiến trúc mở rộng linh hoạt.",
    image: "/images/mobile-development.png",
  },
  {
    icon: MonitorSmartphone,
    tag: "WEB & CLOUD",
    modId: "02",
    title: "Hệ thống Web & Nền tảng Doanh nghiệp",
    description: "Xây dựng dashboard quản trị nội bộ, web app chuyên sâu và landing page tốc độ cao, chuẩn bảo mật phân tán và tối ưu SEO bền vững.",
    image: "/images/management-website.png",
  },
  {
    icon: Gamepad2,
    tag: "3D & GAMING",
    modId: "03",
    title: "Game & Trải nghiệm Tương tác 3D",
    description: "Phát triển gameplay, thế giới số tương tác và các sản phẩm đồ họa kỹ thuật cao với bản sắc thiết kế độc bản và công nghệ hiện đại.",
    image: "/images/game-development.png",
  },
  {
    icon: Wrench,
    tag: "ENGINEERING",
    modId: "04",
    title: "Thiết kế Bản vẽ & Chế tạo máy",
    description: "Từ mô hình 3D, bản vẽ kỹ thuật chi tiết CAD/CAM đến giải pháp máy móc cơ điện tử có thể gia công, chế tạo và vận hành thực tế.",
    image: "/images/ai-machine-engineering.png",
  },
];

function SpotlightCard({ item, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Reveal delay={index * 80} className="tech-card-cell">
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="tech-card spotlight-card"
      >
        <div className="card-spotlight-glow" />

        <div className="tech-card-image-wrapper">
          <ResponsiveImage src={item.image} alt={item.title} className="tech-img-banner" />
          <div className="tech-card-gradient-overlay" />
        </div>

        <div className="tech-card-body">
          <div className="tech-card-header">
            <div className="tech-icon-container">
              <item.icon size={22} />
            </div>
            <div className="tech-badge-group">
              <span className="tech-tag-chip">{item.tag}</span>
              <span className="tech-mod-id">{"// 0" + item.modId}</span>
            </div>
          </div>

          <div className="tech-card-text">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>

          <div className="tech-card-footer">
            <a href="#contact" className="tech-card-action">
              <span>Trao đổi giải pháp</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function TechShowcase() {
  return (
    <section className="section tech-showcase" id="capabilities" aria-label="Năng lực công nghệ">
      <div className="wrap">
        <div className="section-head-center">
          <Reveal>
            <div className="section-eyebrow-box">
              <span className="eyebrow-tag">NĂNG LỰC CỐT LÕI</span>
              <span className="eyebrow-id">{"// CAPABILITIES.01"}</span>
            </div>
            <h2 className="section-title">
              Năng lực đa ngành. <span className="shimmer-text">Một chuẩn triển khai.</span>
            </h2>
            <p className="section-sub">
              Từ kiến trúc mã nguồn phần mềm đến bản vẽ chế tạo cơ khí chính xác, mọi sản phẩm của BThander đều được thiết kế để vận hành bền bỉ và hiệu quả trong thực tế.
            </p>
          </Reveal>
        </div>

        <div className="tech-airy-grid">
          {showcase.map((item, index) => (
            <SpotlightCard key={item.title} item={item} index={index} />
          ))}
        </div>

        <Reveal delay={200}>
          <div className="ai-support-banner">
            <span className="banner-glow-dot" />
            <span>AI hỗ trợ nghiên cứu, tối ưu sáng tạo và tăng tốc quy trình kỹ thuật. BThander không cung cấp dịch vụ huấn luyện mô hình AI riêng lẻ.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
