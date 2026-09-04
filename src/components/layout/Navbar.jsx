import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, LogOut, Menu, Settings, UserCircle, X } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_ITEMS = [
  { href: "#projects", label: "Dự án" },
  { href: "#capabilities", label: "Năng lực" },
  { href: "#products", label: "Dịch vụ" },
  { href: "#team", label: "Đội ngũ" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const accountPath = isAdmin ? "/admin/profile" : "/account";

  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`} aria-label="Điều hướng chính">
      <div className="wrap nav-inner">
        <Link to="/" className="brand-link" aria-label="BThander, về trang chủ">
          <BrandLogo />
        </Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={`/${item.href}`}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          {user ? (
            <div className="profile-menu">
              <button
                className="profile-trigger"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
              >
                <UserCircle size={19} />
                <span>{user.name}</span>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="profile-dropdown">
                  <Link to={accountPath} onClick={() => setMenuOpen(false)}>
                    <UserCircle size={16} /> Hồ sơ cá nhân
                  </Link>
                  <Link to={accountPath} onClick={() => setMenuOpen(false)}>
                    <Settings size={16} /> Cài đặt
                  </Link>
                  <button onClick={signOut}>
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-login">
                Đăng nhập
              </Link>
              <a href="/#contact" className="nav-cta">
                Bắt đầu dự án <ArrowUpRight size={15} />
              </a>
            </div>
          )}
          <button
            className="nav-toggle"
            onClick={() => setNavOpen((value) => !value)}
            aria-expanded={navOpen}
            aria-label={navOpen ? "Đóng menu" : "Mở menu"}
          >
            {navOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {navOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setNavOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-links">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={`/${item.href}`}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {!user ? (
                <Link to="/login" onClick={() => setNavOpen(false)}>
                  Đăng nhập
                </Link>
              ) : (
                <Link to={accountPath} onClick={() => setNavOpen(false)}>
                  Tài khoản ({user.name})
                </Link>
              )}
            </div>
            <a
              className="mobile-menu-cta"
              href="/#contact"
              onClick={() => setNavOpen(false)}
            >
              Bắt đầu dự án <ArrowUpRight size={16} />
            </a>
          </div>
        </>
      )}
    </nav>
  );
}
