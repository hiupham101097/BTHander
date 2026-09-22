import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Send } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/support`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể gửi yêu cầu");
      setForm(initialForm);
      setStatus("sent");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("error");
    }
  };

  return (
    <section className="section contact-section" id="contact" aria-label="Liên hệ và bắt đầu dự án">
      <div className="wrap contact-layout">
        <Reveal>
          <div className="contact-copy">
            <div className="kicker" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
              <span className="kicker-dot" style={{ background: "#3B82F6" }} />
              <span>Bắt đầu trao đổi kỹ thuật</span>
            </div>
            <h2 className="section-title">
              Bạn có dự án hoặc bài toán kỹ thuật?<br />Hãy cùng triển khai bài bản.
            </h2>
            <p className="section-sub">
              Cho chúng tôi biết mục tiêu, phạm vi và thời gian dự kiến. Đội ngũ kỹ sư BThander sẽ phản hồi với lộ trình kỹ thuật và báo giá thực tế.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBlock: "24px 20px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--dark-text-secondary)" }}>
                <CheckCircle2 size={15} style={{ color: "#3B82F6" }} /> Phản hồi trong ngày làm việc
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--dark-text-secondary)" }}>
                <CheckCircle2 size={15} style={{ color: "#3B82F6" }} /> Cam kết bảo mật ý tưởng &amp; mã nguồn
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--dark-text-secondary)" }}>
                <CheckCircle2 size={15} style={{ color: "#3B82F6" }} /> Tư vấn giải pháp &amp; kiến trúc khả thi
              </span>
            </div>

            <div className="contact-note">
              <ChevronRight size={15} /> Sẵn sàng trao đổi trực tiếp hoặc qua video call
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-form-grid">
              <label>
                Họ và tên *
                <input
                  required
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label>
                Email công việc *
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                Số điện thoại
                <input
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>
              <label>
                Tổ chức / Doanh nghiệp
                <input
                  placeholder="Công ty / Đơn vị"
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                />
              </label>
            </div>
            <label>
              Nội dung yêu cầu hoặc bài toán kỹ thuật *
              <textarea
                required
                rows={4}
                placeholder="Mô tả tóm tắt tính năng, yêu cầu kỹ thuật hoặc phạm vi bạn đang cần thực hiện..."
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
              />
            </label>

            {status === "sent" && (
              <p className="form-message form-success">
                Cảm ơn bạn! Yêu cầu đã được gửi đến đội ngũ kỹ thuật BThander. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
              </p>
            )}
            {status === "error" && <p className="form-message form-error">{error}</p>}

            <button
              className="btn-primary"
              disabled={status === "sending"}
              type="submit"
              style={{ marginTop: "4px" }}
            >
              <Send size={15} /> {status === "sending" ? "Đang gửi thông tin..." : "Gửi yêu cầu trao đổi"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
