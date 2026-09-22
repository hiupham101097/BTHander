import React from "react";
import { ArrowUpRight, Gamepad2, MonitorSmartphone, Smartphone, Wrench } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const showcase = [
  {
    num: "01",
    icon: Smartphone,
    tag: "MOBILE APPS",
    title: "Ứng dụng Di động & Đa nền tảng",
    description: "Thiết kế kiến trúc và phát triển ứng dụng di động iOS & Android. Tối ưu hóa render UI, chống giật khung hình và xây dựng API đồng bộ mượt mà.",
    image: "/images/mobile-development.png",
  },
  {
    num: "02",
    icon: MonitorSmartphone,
    tag: "WEB & CLOUD SYSTEMS",
    title: "Hệ thống Web & Nền tảng Doanh nghiệp",
    description: "Xây dựng dashboard quản trị, SaaS platform và các hệ thống nội bộ chuẩn bảo mật, xử lý dữ liệu thời gian thực và kiến trúc microservices.",
    image: "/images/management-website.png",
  },
  {
    num: "03",
    icon: Gamepad2,
    tag: "INTERACTIVE & 3D",
    title: "Game & Trải nghiệm 3D Tương tác",
    description: "Phát triển gameplay, mô hình 3D tương tác thời gian thực và các giải pháp đồ họa kỹ thuật phục vụ trình diễn và mô phỏng thực tế.",
    image: "/images/game-development.png",
  },
  {
    num: "04",
    icon: Wrench,
    tag: "MECHANICAL CAD & MECHATRONICS",
    title: "Thiết kế Kỹ thuật & Chế tạo máy",
    description: "Mô hình hóa 3D SolidWorks/Inventor, xuất bản vẽ 2D chế tạo chi tiết dung sai chuẩn gia công cơ khí chính xác và tích hợp cơ điện tử.",
    image: "/images/ai-machine-engineering.png",
  },
];

export default function TechShowcase() {
  return (
    <section className="section tech-showcase" id="capabilities" aria-label="Năng lực công nghệ">
      <div className="wrap">
        <Reveal>
          <div className="tech-intro">
            <div>
              <div className="kicker">
                <span className="kicker-dot" />
                <span>Năng lực thực thi kỹ thuật</span>
              </div>
              <h2>Kỹ thuật chính xác.<br />Một chuẩn triển khai thực tế.</h2>
            </div>
            <p>
              Từ mã nguồn phần mềm, cơ sở dữ liệu đến bản vẽ chế tạo cơ khí, mọi sản phẩm của BThander đều được xây dựng để vận hành chính xác và ổn định lâu dài.
            </p>
          </div>
        </Reveal>

        <div className="tech-grid">
          {showcase.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="tech-card-wrap">
              <article className="tech-card">
                <div className="tech-card-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="tech-card-content">
                  <div className="tech-card-top">
                    <span className="tech-card-num">{item.num} // SPEC</span>
                    <span className="tech-card-tag">{item.tag}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#contact" className="tech-card-link">
                    Trao đổi giải pháp kỹ thuật <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="ai-support-note">
            AI được sử dụng như công cụ hỗ trợ nghiên cứu, kiểm thử và tối ưu quy trình kỹ thuật. Toàn bộ kiến trúc, thuật toán và giải pháp do đội ngũ kỹ sư BThander trực tiếp thẩm định.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
