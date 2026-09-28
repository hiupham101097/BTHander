import React, { useState } from "react";
import { ArrowRight, Check, ChevronRight, ShieldCheck, Terminal, Clock, Lock } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

const DOMAINS = [
  "Hệ thống Web & Cloud",
  "Ứng dụng Mobile",
  "Bản vẽ CAD & Chế tạo máy",
  "Game 3D & Mô phỏng",
  "Tư vấn Kiến trúc Kỹ thuật",
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [selectedDomain, setSelectedDomain] = useState("Hệ thống Web & Cloud");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const toggleDomain = (domain) => {
    setSelectedDomain((prev) => (prev === domain ? "" : domain));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const payload = {
      ...form,
      message: selectedDomain ? `[LĨNH VỰC: ${selectedDomain}]\n${form.message}` : form.message,
    };

    try {
      await apiRequest("/api/support", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      setForm(initialForm);
      setStatus("sent");
    } catch (requestError) {
      setError(requestError.message || "Gửi yêu cầu chưa thành công. Vui lòng kiểm tra lại kết nối.");
      setStatus("error");
    }
  };

  return (
    <section className="section contact-section" id="contact" aria-label="Trao đổi kỹ thuật và bắt đầu dự án">
      <div className="wrap contact-spacious-layout">
        <Reveal>
          <div className="contact-copy-col">
            <div className="section-eyebrow-box">
              <span className="eyebrow-tag">KẾT NỐI KỸ THUẬT</span>
              <span className="eyebrow-id">{"// INQUIRY.PROTOCOL.06"}</span>
            </div>
            <h2 className="section-title">
              Cùng hiện thực hóa <span className="shimmer-text">bài toán của bạn.</span>
            </h2>
            <p className="section-sub">
              Cho chúng tôi biết mục tiêu, phạm vi và tiến độ mong muốn. Kỹ sư BThander sẽ phân tích kiến trúc, rà soát tính khả thi và phản hồi phương án triển khai cụ thể.
            </p>

            <div className="contact-commitments-list">
              <div className="commitment-item">
                <div className="commitment-icon-wrap">
                  <Clock size={18} />
                </div>
                <div className="commitment-desc">
                  <strong>[SLA 24H] Phản hồi kỹ thuật nhanh chóng</strong>
                  <span>Đánh giá sơ bộ và đề xuất khung giải pháp trong vòng 24 giờ làm việc.</span>
                </div>
              </div>

              <div className="commitment-item">
                <div className="commitment-icon-wrap">
                  <Lock size={18} />
                </div>
                <div className="commitment-desc">
                  <strong>[NDA] Cam kết bảo mật ý tưởng</strong>
                  <span>Ký thỏa thuận bảo mật trước khi tiếp nhận tài liệu và ý tưởng chi tiết.</span>
                </div>
              </div>

              <div className="commitment-item">
                <div className="commitment-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
                <div className="commitment-desc">
                  <strong>[SRC 100%] Bàn giao toàn diện</strong>
                  <span>Bàn giao toàn bộ mã nguồn, tài liệu API và hồ sơ thiết kế CAD gốc.</span>
                </div>
              </div>
            </div>

            <div className="contact-direct-note">
              <ChevronRight size={16} className="note-chevron" />
              <span>Sẵn sàng trao đổi trực tiếp tại TP. Hồ Chí Minh hoặc họp trực tuyến toàn quốc.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="contact-terminal-container">
            <div className="terminal-header-bar">
              <div className="terminal-led-dots">
                <span className="led led-red" />
                <span className="led led-yellow" />
                <span className="led led-green" />
              </div>
              <div className="terminal-brand-title">
                <Terminal size={14} />
                <span>BTH-SECURE-TERMINAL // INQUIRY_DISPATCH</span>
              </div>
              <div className="terminal-encryption-badge">
                <span className="radar-mini-pulse" />
                <span>E2EE 256-BIT</span>
              </div>
            </div>

            <form onSubmit={submit} className="contact-form-spacious">
              <div className="contact-domains-group">
                <span className="domains-label">{"// CHỌN LĨNH VỰC HỢP TÁC:"}</span>
                <div className="domains-chip-row">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      className={`domain-select-chip ${selectedDomain === domain ? "active" : ""}`}
                      onClick={() => toggleDomain(domain)}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="input-group">
                  <label htmlFor="contact-name">Họ và tên *</label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-email">Email trao đổi *</label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nguyenvana@gmail.com"
                  />
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="input-group">
                  <label htmlFor="contact-phone">Số điện thoại / Zalo</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0912 345 678"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-company">Đơn vị / Doanh nghiệp</label>
                  <input
                    id="contact-company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Tên công ty hoặc dự án cá nhân"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="contact-message">Mô tả bài toán hoặc yêu cầu kỹ thuật *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mục tiêu của dự án, tính năng cốt lõi hoặc tài liệu bản vẽ cần triển khai..."
                />
              </div>

              {status === "sent" && (
                <div className="contact-status-banner status-success" role="status">
                  <Check size={18} />
                  <div>
                    <strong>Đã gửi yêu cầu thành công!</strong>
                    <p>Kỹ sư của BThander sẽ liên hệ lại với bạn trong vòng 24 giờ.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="contact-status-banner status-error" role="alert">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary shiny-btn contact-submit-full"
              >
                <span className="btn-shine-sweep" />
                <span className="btn-inner-text">
                  {status === "sending" ? "Đang mã hóa & truyền tải..." : "Gửi yêu cầu hợp tác"}
                  <ArrowRight size={17} />
                </span>
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
