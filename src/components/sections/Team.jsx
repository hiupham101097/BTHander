import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";

export default function Team() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    fetch("/api/team")
      .then((response) => (response.ok ? response.json() : { data: [] }))
      .then((body) => setMembers(body.data || []))
      .catch(() => setMembers([]));
  }, []);

  return (
    <section className="section" id="team">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Đội ngũ" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Hiểu công nghệ, sát nhu cầu triển khai.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            Brave Trust Hander quy tụ những người làm sản phẩm và công nghệ để giải quyết các bài toán thực tế.
          </p>
        </Reveal>

        <div className="team-grid">
          {members.map((member, index) => (
            <Reveal delay={index * 80} key={member.id}>
              <Link className="team-card team-card-link" to={`/team/${member.id}`}>
                <div className="avatar">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} />
                  ) : (
                    <span>{member.name.slice(0, 1)}</span>
                  )}
                </div>
                <div className="team-card-body">
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.title}</div>
                  <span className="team-cta">
                    Xem profile
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .team-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 20px;
          border: 1px solid #E6E4DF;
          border-radius: 4px;
          text-decoration: none;
          color: inherit;
          background: #fff;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .team-card:hover {
          transform: translateY(-4px);
          border-color: #1E5F4E;
        }

        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 1px solid #E6E4DF;
          background: #FAF9F6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar span {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: #14171F;
        }

        .team-name {
          font-weight: 600;
          color: #14171F;
          font-size: 16px;
        }

        .team-role {
          color: #6B7280;
          font-size: 13px;
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .team-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 500;
          color: #1E5F4E;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }

        .team-card:hover .team-cta {
          border-color: #1E5F4E;
        }
      `}</style>
    </section>
  );
}