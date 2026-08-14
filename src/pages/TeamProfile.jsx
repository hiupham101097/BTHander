import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Code2,
  FileText,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

function List({ title, icon: Icon, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="member-section">
      <h2>
        <Icon size={20} />
        {title}
      </h2>

      <div className="member-list">
        {items.map((item, index) => (
          <article key={index}>
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TeamProfile() {
  const { id } = useParams();

  const [member, setMember] = useState(null);

  useEffect(() => {
    loadMember();
  }, [id]);

  async function loadMember() {
    try {
      const response = await fetch(`/api/team/${id}`);

      if (!response.ok) {
        setMember(null);
        return;
      }

      const body = await response.json();
      setMember(body.data);
    } catch (error) {
      setMember(null);
    }
  }

  if (!member) {
    return (
      <div className="wrap detail-state">
        Đang tải hồ sơ thành viên...
      </div>
    );
  }

  return (
    <div className="member-profile">
      {/* Back */}
      <div className="wrap member-back">
        <Link
          to="/#team"
          className="detail-back"
        >
          <ArrowLeft size={15} />
          Quay lại đội ngũ
        </Link>
      </div>

      {/* Hero */}
      <header className="member-hero">
        <div className="wrap member-hero-inner">
          <div className="member-avatar">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.name}
              />
            ) : (
              <UserRound size={46} />
            )}
          </div>

          <div>
            <p>THÀNH VIÊN BTHANDER</p>

            <h1>{member.name}</h1>

            <span>{member.title}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="wrap member-content">
        <section className="member-intro">
          <h2>Giới thiệu</h2>

          <p>
            {member.profile_intro ||
              member.bio ||
              "Thông tin đang được cập nhật."}
          </p>
        </section>

        <List
          title="Kinh nghiệm qua từng giai đoạn"
          icon={BriefcaseBusiness}
          items={member.experience}
        />

        <List
          title="Ngôn ngữ & chuyên môn"
          icon={Code2}
          items={member.skills}
        />

        <List
          title="Dự án tiêu biểu"
          icon={BriefcaseBusiness}
          items={member.featured_projects}
        />

        <Link
          to={`/team/${member.id}/articles`}
          className="member-articles-link"
        >
          <FileText size={20} />

          <span>
            <strong>Góc chia sẻ kinh nghiệm</strong>

            <small>
              Đọc các bài viết và góc nhìn chuyên môn của{" "}
              {member.name}.
            </small>
          </span>
        </Link>
      </main>
    </div>
  );
}