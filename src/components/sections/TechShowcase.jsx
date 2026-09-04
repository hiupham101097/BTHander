import React from "react";
import { ArrowUpRight, Gamepad2, MonitorSmartphone, Smartphone, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const showcase = [
  {
    icon: Smartphone,
    tag: "MOBILE",
    title: "Ứng dụng Mobile",
    description: "Lập trình ứng dụng iOS, Android và đa nền tảng với trải nghiệm mượt mà, tối ưu hiệu năng và dễ mở rộng.",
    image: "/images/mobile-development.png",
    className: "tech-card-mobile",
  },
  {
    icon: MonitorSmartphone,
    tag: "WEB SYSTEM",
    title: "Website quản lý & Nền tảng số",
    description: "Xây dựng hệ thống quản lý, website doanh nghiệp và landing page tốc độ cao, bảo mật và chuẩn SEO.",
    image: "/images/management-website.png",
    className: "tech-card-web",
  },
  {
    icon: Gamepad2,
    tag: "IMMERSIVE",
    title: "Game & Trải nghiệm 3D",
    description: "Phát triển gameplay, thế giới số và các sản phẩm tương tác đồ họa cao có cá tính kỹ thuật riêng biệt.",
    image: "/images/game-development.png",
    className: "tech-card-game",
  },
  {
    icon: Wrench,
    tag: "ENGINEERED",
    title: "Thiết kế & Chế tạo máy",
    description: "Từ mô hình 3D, bản vẽ kỹ thuật chi tiết đến giải pháp máy móc cơ điện tử có thể gia công và sản xuất thực tế.",
    image: "/images/ai-machine-engineering.png",
    className: "tech-card-machine",
  },
];

export default function TechShowcase() {
  return (
    <section className="tech-showcase" id="capabilities" aria-label="Năng lực công nghệ">
      <div className="wrap">
        <Reveal>
          <div className="tech-intro">
            <div>
              <span className="eyebrow">Năng lực thực thi</span>
              <h2>Năng lực đa ngành.<br />Một chuẩn triển khai.</h2>
            </div>
            <p>
              Từ mã nguồn phần mềm đến bản vẽ chế tạo cơ khí, mọi sản phẩm của BThander đều được xây dựng để vận hành chính xác trong thực tế.
            </p>
          </div>
        </Reveal>

        <div className="tech-grid">
          {showcase.map((item, index) => (
            <Reveal key={item.title} delay={index * 90} className="tech-card-wrap">
              <article className={`tech-card ${item.className}`}>
                <img src={item.image} alt={item.title} />
                <div className="tech-card-shade" />
                <div className="tech-motion" aria-hidden="true">
                  <div className="tech-orbit" />
                  <div className="tech-orbit-two" />
                  <div className="tech-pulse" />
                </div>
                <div className="tech-card-content">
                  <div className="tech-card-top">
                    <div className="tech-card-icon">
                      <item.icon size={22} />
                    </div>
                    <span className="tech-card-tag">{item.tag}</span>
                  </div>
                  <div className="tech-card-bottom">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a href="#contact" className="tech-card-link">
                      Trao đổi giải pháp <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <p className="ai-support-note">
            AI hỗ trợ nghiên cứu, tối ưu sáng tạo và tăng tốc quy trình kỹ thuật. BThander không cung cấp dịch vụ huấn luyện mô hình AI riêng lẻ.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
