import React from "react";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <BrandLogo />
          <p>Phần mềm và thiết kế kỹ thuật, được xây dựng để vận hành trong thực tế.</p>
        </div>
        <div className="footer-links"><a href="/#projects">Dự án</a><a href="/#products">Dịch vụ</a><a href="/#team">Đội ngũ</a><a href="/#contact">Liên hệ <ArrowUpRight size={14} /></a></div>
        <div className="footer-social">
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
        </div>
      </div>
      <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} BThander</span><span>Brave Trust Hander</span></div>
    </footer>
  );
}
