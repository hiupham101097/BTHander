import React from "react";
import { ArrowUpRight, Gamepad2, MonitorSmartphone, Smartphone, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const showcase = [
  { icon: Smartphone, tag: "MOBILE", title: "Ứng dụng Mobile", description: "Lập trình ứng dụng iOS, Android và đa nền tảng với trải nghiệm mượt mà, dễ mở rộng.", image: "/images/mobile-development.png", className: "tech-card-mobile" },
  { icon: MonitorSmartphone, tag: "WEB SYSTEM", title: "Website quản lý & Landing page", description: "Xây dựng hệ thống quản lý, website doanh nghiệp và landing page tối ưu cho từng mục tiêu.", image: "/images/management-website.png", className: "tech-card-web" },
  { icon: Gamepad2, tag: "IMMERSIVE", title: "Game & trải nghiệm", description: "Phát triển gameplay, thế giới số và các sản phẩm tương tác có cá tính riêng.", image: "/images/game-development.png", className: "tech-card-game" },
  { icon: Wrench, tag: "ENGINEERED", title: "Thiết kế & chế tạo máy", description: "Từ mô hình 3D, bản vẽ kỹ thuật đến giải pháp máy có thể gia công và sản xuất.", image: "/images/ai-machine-engineering.png", className: "tech-card-machine" },
];

export default function TechShowcase() {
  return (
    <section className="tech-showcase" aria-label="Năng lực công nghệ">
      <div className="wrap">
        <Reveal><div className="tech-intro"><span>01 / NĂNG LỰC CỐT LÕI</span><p>Bốn lĩnh vực. Một tư duy tạo sản phẩm.</p></div></Reveal>
        <div className="tech-grid">
          {showcase.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className={`tech-card ${item.className}`}>
                <img src={item.image} alt="" />
                <div className="tech-card-shade" />
                <div className="tech-motion" aria-hidden="true"><span className="tech-orbit tech-orbit-one" /><span className="tech-orbit tech-orbit-two" /><span className="tech-pulse" /></div>
                <div className="tech-card-content">
                  <div className="tech-card-top"><item.icon size={18} /><span>{item.tag}</span></div>
                  <div><h2>{item.title}</h2><p>{item.description}</p></div>
                  <a href="#contact" aria-label={`Trao đổi về ${item.title}`}>Trao đổi ngay <ArrowUpRight size={16} /></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={260}><p className="ai-support-note">AI được kết hợp như một công cụ hỗ trợ nghiên cứu, sáng tạo và tăng tốc quy trình — không phải dịch vụ xây dựng mô hình AI.</p></Reveal>
      </div>
    </section>
  );
}
