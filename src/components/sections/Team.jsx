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
 //abc
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
    </section>
  );
}