import React from "react";
import { ArrowUpRight, Bot, Gamepad2, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const showcase = [
  { icon: Gamepad2, tag: "IMMERSIVE", title: "Game & trải nghiệm tương tác", description: "Xây dựng thế giới số, gameplay và sản phẩm tương tác có cá tính riêng.", image: "/images/game-development.png", className: "tech-card-game" },
  { icon: Bot, tag: "INTELLIGENT", title: "AI ứng dụng vào thực tế", description: "Tự động hóa luồng công việc và biến dữ liệu thành quyết định thông minh.", image: "/images/ai-machine-engineering.png", className: "tech-card-ai" },
  { icon: Wrench, tag: "ENGINEERED", title: "Thiết kế & chế tạo máy", description: "Từ mô hình 3D, bản vẽ kỹ thuật đến giải pháp máy có thể sản xuất.", image: "/images/ai-machine-engineering.png", className: "tech-card-machine" },
];

export default function TechShowcase() {
  return (
    <section className="tech-showcase" aria-label="Năng lực công nghệ">
      <div className="wrap">
        <Reveal><div className="tech-intro"><span>01 / NĂNG LỰC</span><p>Ba lĩnh vực. Một tư duy tạo sản phẩm.</p></div></Reveal>
        <div className="tech-grid">
          {showcase.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className={`tech-card ${item.className}`}>
                <img src={item.image} alt="" />
                <div className="tech-card-shade" />
                <div className="tech-motion" aria-hidden="true">
                  <span className="tech-orbit tech-orbit-one" />
                  <span className="tech-orbit tech-orbit-two" />
                  <span className="tech-pulse" />
                </div>
                <div className="tech-card-content">
                  <div className="tech-card-top"><item.icon size={18} /><span>{item.tag}</span></div>
                  <div><h2>{item.title}</h2><p>{item.description}</p></div>
                  <a href="#contact" aria-label={`Trao đổi về ${item.title}`}>Trao đổi ngay <ArrowUpRight size={16} /></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
