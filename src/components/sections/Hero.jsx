import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

export default function Hero() {
  return (
    <header className="wrap hero">
      <Reveal>
        <div className="kicker"><Sparkles size={14} /> Điện toán biên cho công nghiệp</div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="h1">
          Đưa trí tuệ nhân tạo ra khỏi phòng lab,{" "}
          <span className="accent">vào tận hiện trường.</span>
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="lead">
          Aurix xây dựng phần cứng và nền tảng AI biên giúp nhà máy, lưới điện, cảng biển và nông trại
          vận hành chính xác hơn — xử lý dữ liệu ngay tại chỗ, không phụ thuộc đường truyền.
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div className="hero-actions">
          <button className="btn-primary">Dùng thử sản phẩm <ChevronRight size={16} /></button>
          <button className="btn-ghost">Xem dự án đã triển khai</button>
        </div>
      </Reveal>
      <Reveal delay={320} className="hero-visual">
        <div className="orbit orbit-1"><span className="orbit-node" /></div>
        <div className="orbit orbit-2"><span className="orbit-node" /></div>
        <div className="hero-visual-label">3.500+ thiết bị đang hoạt động</div>
      </Reveal>
    </header>
  );
}
