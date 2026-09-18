import React, { useEffect, useState } from "react";
import { ArrowUpRight, UsersRound, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";

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
  if (t.includes("phần mềm") || t.includes("kỹ sư") || t.includes("developer") || t.includes("engineer")) {
    return ["Web Architecture", "Frontend", "Backend"];
  }
  if (t.includes("quản trị") || t.includes("admin") || t.includes("lead")) {
    return ["Quản trị hệ thống", "Điều phối", "Giải pháp số"];
  }
  return ["Giải pháp số", "Tối ưu vận hành", "Công nghệ"];
}

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
        setMembers(body.data || []);
        setState("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="section team-section" id="team">
      <div className="wrap team-wrap">
        <div className="team-heading">
          <div>
            <Reveal>
              <div className="kicker">
                <span className="kicker-dot" />
                <span>Đội ngũ kiến tạo & chuyên môn</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="team-title">Những người biến ý tưởng thành sản phẩm.</h2>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="team-heading-side">
              <p className="team-intro">
                Một đội ngũ đa chuyên môn, cùng theo đuổi một mục tiêu: tạo ra những giải pháp số rõ ràng, hữu ích và có thể vận hành trong thực tế.
              </p>
              <div className="team-status-banner">
                <span className="team-pulse-dot" />
                <span>Đội ngũ sẵn sàng đồng hành cùng bạn</span>
              </div>
            </div>
          </Reveal>
        </div>

        {state === "loading" && (
          <div className="team-grid team-grid-loading" aria-label="Đang tải đội ngũ">
            {[0, 1, 2].map((item) => (
              <div className="team-skeleton-card" key={item}>
                <div className="skeleton-top-bar" />
                <div className="skeleton-profile-row">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-id-group">
                    <div className="skeleton-line line-title" />
                    <div className="skeleton-line line-sub" />
                  </div>
                </div>
                <div className="skeleton-line line-bio" />
                <div className="skeleton-line line-bio-short" />
                <div className="skeleton-chips">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}
          </div>
        )}

        {state === "error" && (
          <div className="team-empty">
            <UsersRound size={32} />
            <p>Chưa thể tải thông tin đội ngũ.</p>
            <span>Vui lòng quay lại sau ít phút.</span>
          </div>
        )}

        {state === "ready" && members.length === 0 && (
          <div className="team-empty">
            <UsersRound size={32} />
            <p>Đội ngũ đang được cập nhật.</p>
            <span>Những gương mặt mới sẽ sớm xuất hiện tại đây.</span>
          </div>
        )}

        {state === "ready" && members.length > 0 && (
          <div className="team-grid">
            {members.map((member, index) => {
              const displayName = formatMemberName(member.name);
              const initials = getInitials(displayName);
              const parsedSkills = parseSkills(member.skills);
              const skills = parsedSkills.length > 0 ? parsedSkills.slice(0, 3) : getFallbackSkills(member.title);
              const articleCount = Array.isArray(member.articles) ? member.articles.length : 0;
              const themeClass = `team-theme-${index % 4}`;

              return (
                <Reveal delay={70 + index * 60} key={member.id} className="team-card-reveal">
                  <Link
                    className={`team-card team-card-v2 ${themeClass}`}
                    to={`/team/${member.id}`}
                    aria-label={`Xem hồ sơ của ${displayName}`}
                  >
                    {/* Atmospheric card ambient glow */}
                    <div className="team-card-ambient" aria-hidden="true" />

                    {/* Top Row: Index Tag & Action Arrow */}
                    <div className="team-card-topbar">
                      <div className="team-tag-group">
                        <span className="team-index-tag">#{String(index + 1).padStart(2, "0")}</span>
                        <span className="team-status-chip">
                          <span className="team-chip-dot" />
                          <span>Thành viên cốt lõi</span>
                        </span>
                      </div>
                      <div className="team-arrow-action" aria-hidden="true">
                        <ArrowUpRight size={17} />
                      </div>
                    </div>

                    {/* Avatar & Identity Row */}
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
                        <span className="team-avatar-border" aria-hidden="true" />
                      </div>

                      <div className="team-identity-details">
                        <h3 className="team-name">{displayName}</h3>
                        <div className="team-role-pill">
                          <Sparkles size={12} className="team-role-sparkle" />
                          <span>{member.title || "Chuyên gia kỹ thuật"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="team-bio">
                      {member.bio || member.profile_intro || "Đóng góp nghiên cứu, kiến trúc và hoàn thiện các giải pháp công nghệ chất lượng cao."}
                    </p>

                    {/* Skills Chips */}
                    {skills.length > 0 && (
                      <div className="team-skills-container">
                        {skills.map((skill) => (
                          <span key={skill} className="team-skill-badge">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Action / Meta Footer */}
                    <div className="team-card-footer">
                      <div className="team-footer-meta">
                        {articleCount > 0 ? (
                          <span className="team-articles-counter">
                            <BookOpen size={12} /> {articleCount} bài chia sẻ
                          </span>
                        ) : (
                          <span className="team-explore-hint">Xem hồ sơ & dự án</span>
                        )}
                      </div>
                      <span className="team-cta-button">
                        <span>Khám phá</span>
                        <ArrowUpRight size={14} className="team-cta-arrow" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
