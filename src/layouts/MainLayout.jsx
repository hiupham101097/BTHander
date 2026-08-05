import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
