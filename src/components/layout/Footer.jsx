import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <BrandLogo compact />
          <span>© {new Date().getFullYear()} BThander — nền tảng số cho vận hành thực tế.</span>
        </div>
        <div className="footer-social">
          <a href="#"><Github size={18} /></a>
          <a href="#"><Linkedin size={18} /></a>
          <a href="#"><Twitter size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
