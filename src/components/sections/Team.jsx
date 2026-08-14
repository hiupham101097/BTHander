import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";
import { User } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/team`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải đội ngũ");
        return response.json();
      })
      .then((body) => { setTeam(body.data || []); setState("ready"); })
      .catch((error) => {
        if (error.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="section" id="team">
      <div className="wrap">
        <Reveal><SectionEyebrow label="Đội ngũ" /></Reveal>
        <Reveal delay={60}><h2 className="section-title">Hiểu công nghệ, sát nhu cầu triển khai.</h2></Reveal>
        <Reveal delay={120}>
          <p className="section-sub">
            Brave Trust Hander quy tụ kỹ sư phần mềm, thiết kế sản phẩm và kỹ sư cơ khí để giải quyết trọn vẹn các bài toán thực tế.
          </p>
        </Reveal>

        {state === "loading" && <p className="api-state">Đang tải đội ngũ...</p>}
        {state === "error" && <p className="api-state api-state-error">Chưa thể tải danh sách đội ngũ. Vui lòng thử lại sau.</p>}

        <div className="team-grid">
          {team.map((t, i) => (
            <Reveal delay={i * 80} key={t.id}>
              <Link to={`/team/${t.id}`} className="team-card-link">
                <div className="team-card">
                  <div className="avatar">
                    {t.avatar_url ? <img src={t.avatar_url} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={28} />}
                  </div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.title}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
