import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          © {new Date().getFullYear()} AURIX SYSTEMS — điện toán biên cho công nghiệp thực.
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
