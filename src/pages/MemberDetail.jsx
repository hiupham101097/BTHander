import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, FileText, ChevronRight } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/team/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải thông tin");
        return response.json();
      })
      .then((body) => { setMember(body.data); setState("ready"); })
      .catch(() => { setState("error"); });
  }, [id]);

  if (state === "loading") return <div className="wrap" style={{ padding: "120px 24px", minHeight: "75vh" }}><p className="api-state">Đang tải hồ sơ...</p></div>;
  if (state === "error" || !member) return <div className="wrap" style={{ padding: "120px 24px", minHeight: "75vh" }}><p className="api-state api-state-error">Không tìm thấy thành viên này.</p></div>;

  return (
    <div className="wrap project-detail-page">
      <Link to="/" className="project-detail-back"><ArrowLeft size={16} /> Về trang chủ</Link>
      
      <div className="member-profile-header">
        <div className="member-avatar">
          {member.avatar_url ? <img src={member.avatar_url} alt={member.name} /> : <User size={48} />}
        </div>
        <div>
          <h1 className="h1">{member.name}</h1>
          <div className="member-title">{member.title}</div>
        </div>
      </div>

      <div className="member-bio">
        <p>{member.bio || "Thành viên chưa cập nhật phần giới thiệu cá nhân."}</p>
        {member.contact_info && <div className="member-contact-info"><strong>Liên hệ:</strong> {member.contact_info}</div>}
      </div>

      {member.posts && member.posts.length > 0 ? (
        <div className="member-section">
          <h2 className="section-title">Chia sẻ kinh nghiệm</h2>
          <div className="blog-list">
            {member.posts.map((post) => (
              <div key={post.id} className="blog-card">
                <div className="blog-icon"><FileText size={20} /></div>
                <div className="blog-content">
                  <h3>{post.title}</h3>
                  <div className="blog-date">{new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                  <p>{post.content.substring(0, 150)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="member-section">
          <h2 className="section-title">Chia sẻ kinh nghiệm</h2>
          <p className="empty-state-text">Thành viên này chưa có bài viết nào.</p>
        </div>
      )}

      <div className="member-section">
        <h2 className="section-title">Dự án đã tham gia</h2>
        <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', display: 'grid', gap: '20px' }}>
          {/* Placeholder for future database relation */}
          <p className="empty-state-text">Chưa có thông tin dự án.</p>
        </div>
      </div>

      <div className="member-section">
        <h2 className="section-title">Sản phẩm tiêu biểu</h2>
        <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', display: 'grid', gap: '20px' }}>
           {/* Placeholder for future database relation */}
          <p className="empty-state-text">Chưa có thông tin sản phẩm.</p>
        </div>
      </div>
    </div>
  );
}
