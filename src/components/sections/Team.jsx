import React, { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import { TEAM } from "../../constants/data.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

function getInitials(name = "") {
  if (!name) return "BT";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts.slice(-2).map((part) => part[0]).join("").toUpperCase();
}

function parseSkills(skills) {
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function formatMemberName(name = "") {
  if (!name) return "Thành viên BThander";
  if (name.trim().toLowerCase() === "admin") return "Ban Quản Trị";
  return name;
}

function getFallbackSkills(title = "") {
  const t = title.toLowerCase();
  if (t.includes("thiết kế") || t.includes("ui") || t.includes("ux") || t.includes("designer")) {
    return ["UI/UX Design", "Figma", "Design System"];
  }
  if (t.includes("cơ khí") || t.includes("chế tạo") || t.includes("cad")) {
    return ["SolidWorks", "2D/3D CAD", "Gia công CNC"];
  }
  if (t.includes("phần mềm") || t.includes("kỹ sư") || t.includes("developer") || t.includes("engineer")) {
    return ["Software Architecture", "Frontend", "Backend"];
  }
  if (t.includes("quản trị") || t.includes("lead") || t.includes("sáng lập")) {
    return ["Product Architecture", "Hệ thống số", "Kỹ thuật"];
  }
  return ["Kỹ thuật phần mềm", "Tối ưu vận hành", "Giải pháp số"];
}

const FALLBACK_MEMBERS = TEAM.map((m, idx) => ({
  id: idx + 1,
  name: m.name,
  title: m.role,
  bio: "Tham gia trực tiếp vào nghiên cứu, thiết kế kiến trúc và đảm bảo chất lượng bàn giao cho từng sản phẩm kỹ thuật tại BThander.",
  skills: getFallbackSkills(m.role),
  articles: [],
}));

export default function Team() {
  const [members, setMembers] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/team`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải đội ngũ");
        return response.json();
      })
      .then((body) => {
        const fetched = body.data || [];
        setMembers(fetched.length > 0 ? fetched : FALLBACK_MEMBERS);
        setState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setMembers(FALLBACK_MEMBERS);
          setState("ready");
        }
      });
    return () => controller.abort();
  }, []);

  const displayMembers = members.length > 0 ? members : FALLBACK_MEMBERS;

  return (
    <section className="section team-section" id="team">
      <div className="wrap team-wrap">
        <div className="team-heading">
          <div>
            <div className="kicker">
              <span className="kicker-dot" />
              <span>Đội ngũ Kỹ sư &amp; Chuyên môn</span>
            </div>
            <Reveal>
              <h2 className="team-title">Những người trực tiếp kiến tạo giải pháp.</h2>
            </Reveal>
          </div>
          <Reveal delay={70}>
            <div className="team-heading-side">
              <p className="team-intro">
                Đội ngũ đa lĩnh vực từ kỹ sư phần mềm, lập trình viên di động đến kỹ sư thiết kế cơ điện tử, cùng chung một chuẩn mực về sự chính xác và hiệu quả thực tế.
              </p>
              <div className="team-status-banner">
                <span className="team-pulse-dot" />
                <span>Sẵn sàng tham gia &amp; đồng hành cùng dự án</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="team-grid">
          {displayMembers.map((member, index) => {
            const displayName = formatMemberName(member.name);
            const initials = getInitials(displayName);
            const parsedSkills = parseSkills(member.skills);
            const skills = parsedSkills.length > 0 ? parsedSkills.slice(0, 3) : getFallbackSkills(member.title);
            const articleCount = Array.isArray(member.articles) ? member.articles.length : 0;
            const indexStr = String(index + 1).padStart(2, "0");

            return (
              <Reveal delay={index * 60} key={member.id} className="team-card-reveal">
                <Link
                  className="team-card"
                  to={`/team/${member.id}`}
                  aria-label={`Xem hồ sơ của ${displayName}`}
                >
                  <div className="team-card-topbar">
                    <span className="team-index-tag">#{indexStr} // ROSTER</span>
                    <div className="team-arrow-action" aria-hidden="true">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>

                  <div className="team-identity-layout">
                    <div className="team-avatar-wrapper">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={`Chân dung ${displayName}`}
                          className="team-avatar-photo"
                          loading="lazy"
                        />
                      ) : (
                        <div className="team-monogram-badge" aria-hidden="true">
                          <span>{initials}</span>
                        </div>
                      )}
                    </div>

                    <div className="team-identity-details">
                      <h3 className="team-name">{displayName}</h3>
                      <div className="team-role-pill">
                        {member.title || "Kỹ sư kỹ thuật"}
                      </div>
                    </div>
                  </div>

                  <p className="team-bio">
                    {member.bio || member.profile_intro || "Đóng góp nghiên cứu, kiến trúc và hoàn thiện các giải pháp công nghệ chất lượng cao."}
                  </p>

                  {skills.length > 0 && (
                    <div className="team-skills-container">
                      {skills.map((skill) => (
                        <span key={skill} className="team-skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="team-card-footer">
                    <div className="team-footer-meta">
                      {articleCount > 0 ? (
                        <span className="team-articles-counter">
                          <BookOpen size={12} /> {articleCount} bài chia sẻ
                        </span>
                      ) : (
                        <span className="team-explore-hint">Xem hồ sơ kỹ thuật</span>
                      )}
                    </div>
                    <span className="team-cta-button">
                      <span>Chi tiết</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
