import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "#projects", label: "Dự án" },
  { href: "#achievements", label: "Thành tựu" },
  { href: "#products", label: "Sản phẩm" },
  { href: "#team", label: "Đội ngũ" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand">
          <span className="brand-dot" />AURIX
        </Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="nav-cta">Liên hệ tư vấn</button>
          <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
