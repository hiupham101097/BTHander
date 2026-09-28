import React, { useEffect, useRef } from "react";

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, radius: 180, active: false };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Gravity Stars & Cosmic Nodes
    const starCount = Math.min(Math.floor((width * height) / 18000), 65);
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.45 ? "56, 189, 248" : "129, 140, 248", // Cyan or Indigo
      });
    }

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let tick = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      tick += 0.02;

      // Soft connections between close stars
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Wrap edges gracefully
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Gravity interaction with mouse
        if (mouse.active) {
          const mdx = mouse.x - s.x;
          const mdy = mouse.y - s.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const force = (1 - mdist / mouse.radius) * 0.6;
            s.x += (mdx / mdist) * force;
            s.y += (mdy / mdist) * force;

            // Connection beam to mouse
            const lineAlpha = (1 - mdist / mouse.radius) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        // Twinkle
        const currentAlpha = Math.max(0.1, s.alpha + Math.sin(tick + s.twinkleOffset) * 0.18);

        // Draw star halo
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha * 0.25})`;
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="cyber-ambient-system" aria-hidden="true">
      <div className="cyber-grid-overlay" />
      <div className="cosmic-nebula nebula-center" />
      <div className="cosmic-nebula nebula-top-right" />
      <div className="cosmic-nebula nebula-bottom-left" />
      <canvas ref={canvasRef} className="cyber-canvas" />
    </div>
  );
}
