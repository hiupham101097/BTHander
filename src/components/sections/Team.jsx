import React, { useEffect, useState } from "react";
import { ArrowUpRight, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase();
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
          <Reveal>
            <h2 className="team-title">Những người biến ý tưởng thành sản phẩm.</h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="team-intro">Một đội ngũ đa chuyên môn, cùng theo đuổi một mục tiêu: tạo ra những giải pháp số rõ ràng, hữu ích và có thể vận hành trong thực tế.</p>
          </Reveal>
        </div>

        {state === "loading" && (
          <div className="team-grid team-grid-loading" aria-label="Đang tải đội ngũ">
            {[0, 1, 2, 3].map((item) => <div className="team-skeleton" key={item}><span /><i /><i /></div>)}
          </div>
        )}

        {state === "error" && (
          <div className="team-empty"><UsersRound size={28} /><p>Chưa thể tải thông tin đội ngũ.</p><span>Vui lòng quay lại sau.</span></div>
        )}

        {state === "ready" && members.length === 0 && (
          <div className="team-empty"><UsersRound size={28} /><p>Đội ngũ đang được cập nhật.</p><span>Những gương mặt mới sẽ sớm xuất hiện tại đây.</span></div>
        )}

        {state === "ready" && members.length > 0 && (
          <div className="team-grid">
            {members.map((member, index) => (
              <Reveal delay={80 + index * 70} key={member.id} className="team-card-reveal">
                <Link className="team-card team-card-link" to={`/team/${member.id}`} aria-label={`Xem hồ sơ của ${member.name}`}>
                  <div className="team-portrait">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" loading="lazy" />
                    ) : (
                      <div className="team-monogram" aria-hidden="true">{getInitials(member.name)}</div>
                    )}
                    <span className="team-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="team-open"><ArrowUpRight size={18} /></span>
                  </div>
                  <div className="team-card-body">
                    <div>
                      <h3 className="team-name">{member.name}</h3>
                      <p className="team-role">{member.title}</p>
                    </div>
                    {member.bio && <p className="team-bio">{member.bio}</p>}
                    <span className="team-cta">Khám phá hồ sơ <ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
