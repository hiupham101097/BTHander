import React from "react";
import Hero from "../components/sections/Hero.jsx";
import Stats from "../components/sections/Stats.jsx";
import Projects from "../components/sections/Projects.jsx";
import Products from "../components/sections/Products.jsx";
import Team from "../components/sections/Team.jsx";
import CTA from "../components/sections/CTA.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Projects />
      <Products />
      <Team />
      <CTA />
    </>
  );
}
