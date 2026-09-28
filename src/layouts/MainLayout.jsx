import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import CyberBackground from "../components/ui/CyberBackground.jsx";

export default function MainLayout() {
  return (
    <div className="root public-shell">
      <CyberBackground />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
