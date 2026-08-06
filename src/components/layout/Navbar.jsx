import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_ITEMS = [
  { href: "#projects", label: "Dự án" },
  { href: "#achievements", label: "Năng lực" },
  { href: "#products", label: "Dịch vụ" },
  { href: "#team", label: "Đội ngũ" },
  { href: "#contact", label: "Liên hệ" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand-link"><BrandLogo /></Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to={user ? (isAdmin ? "/admin" : "/account") : "/login"} className="nav-cta">{user ? "Tài khoản" : "Đăng nhập"}</Link>
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
