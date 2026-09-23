import React, { useState } from "react";
import { ArrowRight, Check, ChevronRight, Send, ShieldCheck, Terminal } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

const DOMAINS = [
  "Hệ thống Web",
  "Ứng dụng Mobile",
  "Thiết kế CAD & Chế tạo máy",
  "Game 3D & Mô phỏng",
  "Tư vấn Kỹ thuật",
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [selectedDomain, setSelectedDomain] = useState("Hệ thống Web");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const toggleDomain = (domain) => {
    setSelectedDomain((prev) => (prev === domain ? "" : domain));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const payload = {
      ...form,
      message: selectedDomain ? `[LĨNH VỰC: ${selectedDomain}]\n${form.message}` : form.message,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/support`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
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
    <section className="section contact-section" id="contact" aria-label="Trao đổi kỹ thuật và bắt đầu dự án">
      <div className="wrap contact-layout">
        <Reveal>
          <div className="contact-copy">
            <span className="eyebrow">// INQUIRY PROTOCOL</span>
            <h2 className="section-title">Cùng hiện thực hóa bài toán kỹ thuật của bạn.</h2>
            <p className="section-sub">
              Cho chúng tôi biết mục tiêu, phạm vi và tiến độ mong muốn. Đội ngũ kỹ sư BThander sẽ phân tích kiến trúc, rà soát tính khả thi và phản hồi phương án triển khai thực tế.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", color: "var(--ink-mid)", fontSize: "13px", fontFamily: "monospace" }}>
                <span style={{ color: "var(--neon)", display: "inline-flex" }}>[SLA]</span>
                <span>Phản hồi kỹ thuật trong 24 giờ làm việc</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", color: "var(--ink-mid)", fontSize: "13px", fontFamily: "monospace" }}>
                <span style={{ color: "var(--neon)", display: "inline-flex" }}>[NDA]</span>
                <span>Cam kết bảo mật toàn vẹn ý tưởng &amp; dữ liệu</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", color: "var(--ink-mid)", fontSize: "13px", fontFamily: "monospace" }}>
                <span style={{ color: "var(--neon)", display: "inline-flex" }}>[SRC]</span>
                <span>Bàn giao mã nguồn &amp; hồ sơ bản vẽ đầy đủ</span>
              </div>
            </div>

            <div className="contact-note" style={{ marginTop: "24px" }}>
              <ChevronRight size={15} style={{ color: "var(--neon)" }} /> Sẵn sàng trao đổi trực tiếp tại TP. Hồ Chí Minh hoặc online.
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="contact-terminal-box">
            <div className="contact-terminal-header">
              <div className="contact-terminal-title">
                <Terminal size={14} />
                <span>INTAKE_TERMINAL // BTHANDER_ENG</span>
              </div>
              <div className="contact-terminal-status">
                <span />
                <span>READY</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={submit}>
              {/* Category selector */}
              <div className="contact-category-group">
                <div className="contact-category-label">[ LĨNH VỰC BÀI TOÁN ]</div>
                <div className="contact-category-chips">
                  {DOMAINS.map((domain) => {
                    const isSelected = selectedDomain === domain;
                    return (
                      <button
                        type="button"
                        key={domain}
                        className={`contact-chip ${isSelected ? "active" : ""}`}
                        onClick={() => toggleDomain(domain)}
                      >
                        {isSelected && <Check size={11} style={{ marginRight: "4px", verticalAlign: "middle" }} />}
                        {domain}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input grid */}
              <div className="contact-form-grid">
                <label>
                  [01] Họ và tên *
                  <input
                    required
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </label>
                <label>
                  [02] Email công việc *
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>
                <label>
                  [03] Số điện thoại
                  <input
                    placeholder="0912 345 678"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                </label>
                <label>
                  [04] Công ty / Đơn vị
                  <input
                    placeholder="Tổ chức / Dự án"
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                  />
                </label>
              </div>

              {/* Message */}
              <label>
                [05] Yêu cầu hoặc bài toán kỹ thuật *
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả mục tiêu sản phẩm, tính năng cốt lõi hoặc yêu cầu kỹ thuật cần triển khai..."
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                />
              </label>

              {status === "sent" && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(62, 207, 142, 0.12)",
                    border: "1px solid rgba(62, 207, 142, 0.35)",
                    borderRadius: "4px",
                    color: "var(--neon)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  ✓ Yêu cầu kỹ thuật đã được tiếp nhận. Đội ngũ BThander sẽ phản hồi sớm nhất.
                </div>
              )}
              {status === "error" && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    borderRadius: "4px",
                    color: "#f87171",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Terminal Footer */}
              <div className="contact-terminal-footer">
                <div className="contact-sla-notes">
                  <span>
                    <ShieldCheck size={13} style={{ color: "var(--neon)" }} /> Bảo mật thông tin kỹ thuật
                  </span>
                  <span>Thời gian tiếp nhận: 24/7</span>
                </div>

                <button className="contact-submit-btn" disabled={status === "sending"} type="submit">
                  {status === "sending" ? (
                    "ĐANG XỬ LÝ..."
                  ) : (
                    <>
                      <span>TIẾP NHẬN YÊU CẦU</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
