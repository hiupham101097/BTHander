import React, { useRef } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import useApiList from "../../hooks/useApiList.js";
import { TEAM as DEFAULT_TEAM } from "../../constants/data.js";

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
    } catch { /* legacy */ }
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
    return ["UI/UX Design", "Figma", "Design Systems"];
  }
  if (t.includes("phần mềm") || t.includes("kỹ sư") || t.includes("developer") || t.includes("engineer")) {
    return ["React & Node.js", "Full-stack", "Cloud Architecture"];
  }
  if (t.includes("cơ khí") || t.includes("cad") || t.includes("máy")) {
    return ["SolidWorks / CAD", "Cơ điện tử", "Chế tạo máy"];
  }
  return ["Giải pháp số", "Tối ưu vận hành", "Nghiên cứu & Triển khai"];
}

const FALLBACK_MEMBERS = DEFAULT_TEAM.map((m, idx) => ({
  id: String(idx + 1),
  name: m.name,
  title: m.role,
  bio: `Đồng hành phát triển các giải pháp chất lượng cao tại Brave Trust Hander.`,
  skills: getFallbackSkills(m.role),
}));

function TeamCard({ member, index }) {
  const cardRef = useRef(null);
  const displayName = formatMemberName(member.name);
  const initials = getInitials(displayName);
  const parsedSkills = parseSkills(member.skills);
  const skills = parsedSkills.length > 0 ? parsedSkills.slice(0, 3) : getFallbackSkills(member.title);
  const articleCount = Array.isArray(member.articles) ? member.articles.length : 0;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Reveal delay={70 + index * 60} className="team-card-cell">
      <Link
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="team-card spotlight-card"
        to={`/team/${member.id}`}
        aria-label={`Xem hồ sơ của ${displayName}`}
      >
        <div className="card-spotlight-glow" />

        <div className="team-card-topbar">
          <div className="team-tag-group">
            <span className="team-index-tag">{"#" + String(index + 1).padStart(2, "0")}</span>
            <span className="team-status-chip">
              <span className="team-chip-dot" />
              <span>Kỹ sư cốt lõi</span>
            </span>
          </div>
          <span className="team-open-arrow">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="team-profile-header">
          <div className="team-avatar-box">
            <span className="avatar-ring-glow" />
            <div className="team-avatar-initials">{initials}</div>
          </div>
          <div className="team-id-group">
            <h3 className="team-name">{displayName}</h3>
            <p className="team-role">{member.title || "Kỹ sư chuyên trách"}</p>
          </div>
        </div>

        <p className="team-bio">
          {member.bio || member.profile_intro || "Tham gia trực tiếp vào quá trình thiết kế kiến trúc và đảm bảo tiến độ bàn giao dự án."}
        </p>

        <div className="team-card-footer">
          <div className="team-skills-list">
            {skills.map((skill) => (
              <span key={skill} className="team-skill-chip">
                {skill}
              </span>
            ))}
          </div>

          {articleCount > 0 && (
            <div className="team-articles-badge">
              <BookOpen size={13} />
              <span>{articleCount} bài viết chuyên môn</span>
            </div>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

export default function Team() {
  const { data: apiMembers } = useApiList("/api/team");
  const members = (apiMembers && apiMembers.length > 0) ? apiMembers : FALLBACK_MEMBERS;

  return (
    <section className="section team-section" id="team" aria-label="Đội ngũ chuyên môn">
      <div className="wrap team-wrap">
        <div className="team-heading-spacious">
          <div>
            <Reveal>
              <div className="section-eyebrow-box">
                <span className="eyebrow-tag">ĐỘI NGŨ KỸ SƯ</span>
                <span className="eyebrow-id">{"// CORE-ENGINEERS.05"}</span>
              </div>
              <h2 className="team-title">
                Những người biến ý tưởng <span className="shimmer-text">thành sản phẩm thật.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="team-heading-side">
              <p className="team-intro">
                Đội ngũ đa ngành kết hợp chặt chẽ giữa lập trình phần mềm hiện đại và kỹ thuật chế tạo cơ khí chính xác, cùng hướng đến giá trị thực thi bền vững.
              </p>
              <div className="team-status-banner">
                <span className="team-pulse-dot" />
                <span>Đội ngũ sẵn sàng đồng hành cùng dự án của bạn</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="team-spacious-grid">
          {members.map((member, index) => (
            <TeamCard key={member.id || member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
