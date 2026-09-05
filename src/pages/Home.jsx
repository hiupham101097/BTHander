import React from "react";
import Hero from "../components/sections/Hero.jsx";
import TechShowcase from "../components/sections/TechShowcase.jsx";
import Stats from "../components/sections/Stats.jsx";
import Projects from "../components/sections/Projects.jsx";
import AppSimulatorShowcase from "../components/sections/AppSimulatorShowcase.jsx";
import FreeApps from "../components/sections/FreeApps.jsx";
import Products from "../components/sections/Products.jsx";
import Team from "../components/sections/Team.jsx";
import Contact from "../components/sections/Contact.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <TechShowcase />
      <Stats />
      <Projects />
      <AppSimulatorShowcase />
      <FreeApps />
      <Products />
      <Team />
      <Contact />
    </>
  );
}
