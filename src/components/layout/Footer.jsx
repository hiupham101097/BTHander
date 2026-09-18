import React from "react";
import { ArrowUpRight, Facebook, Github, Linkedin, Mail, MapPin, ShieldCheck, Terminal } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap footer-expanded">
        <div className="footer-col footer-col-brand">
          <BrandLogo />
          <p className="footer-desc">
            Brave Trust Hander (BThander) — Kết hợp năng lực phần mềm và kỹ thuật chế tạo máy, mang đến những sản phẩm công nghệ có thể triển khai thực tế.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">
              <ShieldCheck size={14} /> Tiêu chuẩn kỹ thuật cao
            </span>
            <span className="footer-badge">
              <Terminal size={14} /> Bàn giao mã nguồn đầy đủ
            </span>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Điều hướng</div>
          <ul className="footer-nav-list">
            <li><a href="/#projects">Dự án thực tế</a></li>
            <li><a href="/#capabilities">Năng lực công nghệ</a></li>
            <li><a href="/#products">Dịch vụ kỹ thuật</a></li>
            <li><a href="/#team">Đội ngũ chuyên môn</a></li>
            <li><a href="/#free-apps">Công cụ miễn phí</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Chuyên môn</div>
          <ul className="footer-nav-list">
            <li><a href="/#capabilities">Phần mềm quản lý &amp; Web</a></li>
            <li><a href="/#capabilities">Ứng dụng di động đa nền tảng</a></li>
            <li><a href="/#capabilities">Game &amp; Tương tác 3D</a></li>
            <li><a href="/#capabilities">Thiết kế &amp; Chế tạo máy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Liên hệ</div>
          <div className="footer-contact-item">
            <MapPin size={15} />
            <span>558 Lê Trọng Tấn, Tân Bình, Hồ Chí Minh, Việt Nam</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={15} />
            <span>hieupham101097@gmail.com</span>
          </div>
          <div className="footer-social-row">
            <a href="https://www.facebook.com/profile.php?id=61587912490570" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-btn">
              <Facebook size={17} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-social-btn">
              <Github size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-btn">
              <Linkedin size={17} />
            </a>
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom-bar">
        <span>© {new Date().getFullYear()} BThander — Brave Trust Hander. Bảo lưu mọi quyền.</span>
        <div className="footer-bottom-links">
          <a href="/#contact">Bắt đầu dự án <ArrowUpRight size={13} /></a>
        </div>
      </div>
    </footer>
  );
}
